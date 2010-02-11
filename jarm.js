/* Possible Refactoring:
 *  - sprite objects
 *  - view object
 *    - messages manager
 *  - input manager
 *  - resource manager
 *
 * Thoughts on Views:
 *  - locked view
 *    - locks onto a sprite, every update() it positions to be over the sprite
 *    - disable moveBackground
 *  - scroll view
 *    - moves around based on some control
 */
var Animation = $.gameQuery.Animation;
var keycodes = $.gameQueryExt.keycodes;
var keyTracker;

var game = {
  background: null,
  playground: null,
  farmer: null,
  dialog: null,

  // config params
  frameRate: 1000 / 50,
  worldSize: 2000,

  searchRadius: 40,

  state: "not started",
  messages: []
};
game.moveSpeed = 5 / game.frameRate;
game.objects = new $.gameQueryExt.QuadTree(game.worldSize, game.worldSize);

var animations = {
  walkingAnim: {},

  lastWalkingAnim: 0
};

function toWindowCoords(hash){
  var pg = game.playground.offset();
  var bg = game.background.position();

  return {
    left: hash.left + bg.left + pg.left,
    top: hash.top + bg.top + pg.top
  };
}

function drawMessages(){
  if (drawMessages.threshold === undefined){
    drawMessages.threshold = 3000;
    drawMessages.timeout = null;
  }
  var current;
  var text = "";
  var now = new Date().getTime();

  while (game.messages.length > 0 && now - game.messages[0].timestamp > drawMessages.threshold){
    game.messages.shift();
  }

  if (game.messages.length === 0){
    $("#msg").html("").hide();
    clearTimeout(drawMessages.timeout);
    drawMessages.timeout = null;
  }else{
    for (var i = 0; i < game.messages.length; i++){
      current = game.messages[i];

      text += current.message + "<br />";
    }

    if (drawMessages.timeout !== null){
      clearTimeout(drawMessages.timeout);
    }
    drawMessages.timeout = setTimeout("drawMessages()", 1000);
    $("#msg").html(text).show();
  }

}

function drawInventory(){
  var current;
  var text = "";

  if (game.farmer.inventory.length === 0){
    text = "<i>Nothing</i>";
  }else{
    for (var i = 0; i < game.farmer.inventory.length; i++){
      current = game.farmer.inventory[i];

      text += current.name + "<br />";
    }
  }

  $("#inventory").html(text);
}

function addMessage(message){
  game.messages.push({
    message: message,
    timestamp: new Date().getTime()
  });
  drawMessages();
}

function visibleObjects(){
  return game.objects.get(-game.background.position().left, -game.background.position().top,
    game.playground.width(), game.playground.height());
}

function moveSprite(sprite, dx, dy){
  if (dx === 0 && dy === 0){
    return false;
  }

  var offset = sprite.position();

  if (offset.left + dx < 0){
    dx = -offset.left;
  }else if (offset.left + sprite.width() + dx > game.background.width()){
    dx = game.background.width() - offset.left - sprite.width();
  }

  if (offset.top + dy < 0){
    dy = -offset.top;
  }else if (offset.top + sprite.height() + dy > game.background.height()){
    dy = game.background.height() - offset.top - sprite.height();
  }

  var hit = false;
  
  // TODO: pull this out into a function called collide()
  $.each(visibleObjects(), function(i, obj){
    if (hit) { return; }
    if ($.gameQueryExt.rectOverlap(offset.left + dx, offset.top + dy,
                    sprite.width(), sprite.height(),
                    obj.position().left, obj.position().top,
                    obj.width(), obj.height())){
      hit = true;
    }
  });

  if (!hit){
    sprite.offset(toWindowCoords(
      {
        left: offset.left + dx,
        top: offset.top + dy
      }
    ));
    return true;
  }
  return false;
}

function gameLoop(){
  var timeElapsed = $.gameQueryExt.getTimeElapsed();

  if (game.state == "playing"){
    // Get movement
    var dx = 0, dy = 0;
    var anim = animations.walkingAnim.idle;
    if ($.gameQueryExt.keyDown("left")){
      dx -= game.moveSpeed;
      anim = animations.walkingAnim.west;
    }
    if ($.gameQueryExt.keyDown("right")){
      dx += game.moveSpeed;
      anim = animations.walkingAnim.east;
    }
    if ($.gameQueryExt.keyDown("up")){
      dy -= game.moveSpeed;
      anim = animations.walkingAnim.north;
    }
    if ($.gameQueryExt.keyDown("down")){
      dy += game.moveSpeed;
      anim = animations.walkingAnim.south;
    }

    dx *= timeElapsed;
    dy *= timeElapsed;

    if (anim != animations.lastWalkingAnim){
      game.farmer.setAnimation(anim);
      animations.lastWalkingAnim = anim;
    }

    if (dx !== 0 || dy !== 0){
      if (moveSprite(game.farmer, dx, dy)){
        if (game.farmer.position().left >= game.playground.width() / 2 &&
            game.farmer.position().left <= game.background.width() - game.playground.width() / 2){
          $.gameQueryExt.bg.scroll(dx, 0);
        }

        if (game.farmer.position().top >= game.playground.height() / 2 &&
            game.farmer.position().top <= game.background.height() - game.playground.height() / 2){
          $.gameQueryExt.bg.scroll(0, dy);
        }
      }
    }
  }

  return false;
}

function activateBush(bush){
  var plant = plants.getRandomSeed();

  if (plant === null){
    addMessage("Nothing found.");
  }else{
    addMessage("found " + plant.type + " seeds");
    game.farmer.inventory.push(plant);
    drawInventory();
  }
}

function activatePlot(plot){
  game.dialog = new PlantingDialog();
}

$(function(){
  $("#playground").playground({width: 800, height: 600, keyTracker: true});
  game.playground = $.playground();

  loadPlants();
  loadWalkingAnim();
  loadObjects();
  initializeFarmer();

  registerCallbacks();

  drawInventory();

  game.state = "playing";
  game.playground
    .registerCallback(gameLoop, game.frameRate)
    .startGame();

  keyTracker = $.gameQuery.keyTracker;
  game.background = $.gameQueryExt.bg.set("#sceengraph",
    {width: game.worldSize, height: game.worldSize, imageURL: "images/grass.png"});
});

// This one is called when the user presses space
function activate(){
  var nearby = visibleObjects();

  var obj;
  $("#msg").html("");
  for (var i = 0; i < nearby.length; i++){
    obj = nearby[i];

    if (near(obj, game.farmer, game.searchRadius)){
      if (obj.attr("id").match(/bush/)){
        activateBush(obj);
        break;
      }else if (obj.attr("id").match(/plot/)){
        activatePlot(obj);
        break;
      }
    }
  }
}

function onKeyPress(ev){
  if (game.state == "playing"){
    if (ev.which == keycodes.space){
      activate();
    }
  }else if (game.state == "paused"){
    if (ev.which == keycodes.escape && game.dialog !== null){
      game.dialog.close();
    }
  }
}
