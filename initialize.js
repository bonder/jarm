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

  game.playground
    .addSprite("plot1", {animation: animations.plot,
      width: 30, height: 30, posx: 340, posy: 300});
  game.objects.add($("#plot1"), 340, 300);
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
  $(document).keypress(onKeyPress);
}

function initializeFarmer(){
  game.playground
    .addSprite("farmer", {animation: animations.walkingAnim.idle,
      width: 16, height: 16, posx: 400, posy: 300});
  game.farmer = $("#farmer");
  game.farmer.inventory = [];
}
