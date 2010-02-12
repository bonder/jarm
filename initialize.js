$(function(){
  $("#playground").playground({width: 800, height: 600, keyTracker: true});
  game.playground = $.playground();
  game.background = $("#sceengraph");

  loadPlants();
  loadWalkingAnim();
  loadObjects();
  initializeFarmer();

  view = new JarmView();
  registerCallbacks();

  game.state = "playing";
  game.playground
    .startGame();

  keyTracker = $.gameQuery.keyTracker;
});

function loadPlants(){
  var tree = new Animation({imageURL: "images/tree.png"});
  for (var i = 0; i < 10; i++){
    var x = Math.floor(Math.random() * (game.worldSize - 38));
    var y = Math.floor(Math.random() * (game.worldSize - 38));
    game.playground.addSprite("tree" + i, {animation: tree, width: 45, height: 38,
      posx: x, posy: y});
    $("#tree" + i).addClass("collideable");
    game.objects.add($("#tree" + i), x, y);
  }

  var bush = new Animation({imageURL: "images/bush.png"});
  for (var i = 0; i < 30; i++){
    var x = Math.floor(Math.random() * (game.worldSize - 28));
    var y = Math.floor(Math.random() * (game.worldSize - 28));
    game.playground.addSprite("bush" + i, {animation: bush, width: 40, height: 28,
      posx: x, posy: y});
    $("#bush" + i).addClass("collideable");
    game.objects.add($("#bush" + i), x, y);
  }
}

function loadObjects(){
  animations.plot = new Animation({imageURL: "images/plot.png"});

  for (var i = 1; i < 6; i++){
    game.playground
      .addSprite("plot" + i, {animation: animations.plot,
        width: 30, height: 30, posx: 260 + (i * 40), posy: 350});
    var plot = $("#plot" + i);
    plot.contains = null;
    game.objects.add(plot, 260 + i * 40, 350);
    game.plots["plot" + i] = plot;
  }
}

function loadWalkingAnim(){
  animations.walkingAnim.idle = new Animation({imageURL: "images/farmer.png"});
  animations.walkingAnim.west = new Animation({imageURL: "images/walking-west.png",
    numberOfFrame: 2, type: $.gameQuery.ANIMATION_HORIZONTAL, rate: game.frameRate * 10, delta: 16});
  animations.walkingAnim.east = new Animation({imageURL: "images/walking-east.png",
    numberOfFrame: 2, type: $.gameQuery.ANIMATION_HORIZONTAL, rate: game.frameRate * 10, delta: 16});
  animations.walkingAnim.north = new Animation({imageURL: "images/walking-north.png",
    numberOfFrame: 2, type: $.gameQuery.ANIMATION_HORIZONTAL, rate: game.frameRate * 10, delta: 16});
  animations.walkingAnim.south = new Animation({imageURL: "images/walking-south.png",
    numberOfFrame: 2, type: $.gameQuery.ANIMATION_HORIZONTAL, rate: game.frameRate * 10, delta: 16});
}

function registerCallbacks(){
  game.playground
    .registerCallback(gameLoop, view.frameRate)
    .registerCallback(function() {view.update();}, view.updateRate);
  $(document).keypress(onKeyPress);
}

function initializeFarmer(){
  game.playground
    .addSprite("farmer", {animation: animations.walkingAnim.idle,
      width: 16, height: 16, posx: 400, posy: 300});
  game.farmer = $("#farmer");

  // TODO: make more advanced inventory system
  game.farmer.inventory = [];
  game.farmer.facing = "south";
}
