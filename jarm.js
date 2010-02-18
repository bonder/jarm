/**
 * Copyright (C) 2010 Rob Britton

 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.

 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
  dialog: null,

  farmer: null,
  plots: {},

  // config params
  worldSize: 2000,
  moveSpeed: 5,

  searchRadius: 40,

  state: "not started"
};
var animations = {
};
game.objects = new $.gameQueryExt.QuadTree(game.worldSize, game.worldSize);
var view;

function toWindowCoords(hash){
  var pg = game.playground.offset();
  var bg = game.background.position();

  return {
    left: hash.left + bg.left + pg.left,
    top: hash.top + bg.top + pg.top
  };
}

function visibleObjects(){
  return game.objects.get(-game.background.position().left, -game.background.position().top,
    game.playground.width(), game.playground.height());
}

function gameLoop(){
  var timeElapsed = $.gameQueryExt.getTimeElapsed();

  if (game.state == "playing"){
    // Get movement
    var dx = 0, dy = 0;

    var anim = "idle";
    if ($.gameQueryExt.keyDown("left")){
      dx -= game.moveSpeed;
      anim = "west";
    }
    if ($.gameQueryExt.keyDown("right")){
      dx += game.moveSpeed;
      anim = "east";
    }
    if ($.gameQueryExt.keyDown("up")){
      dy -= game.moveSpeed;
      anim = "north";
    }
    if ($.gameQueryExt.keyDown("down")){
      dy += game.moveSpeed;
      anim = "south";
    }

    // need to floor it to prevent jittering
    dx = Math.floor(dx * timeElapsed / JarmView.frameRate);
    dy = Math.floor(dy * timeElapsed / JarmView.frameRate);

    game.farmer.setAnimation(anim);
    game.farmer.move(dx, dy);

    var plot;
    for (var i in game.plots){
      if (i.match(/plot/)){
        plot = game.plots[i];

        if (plot.contains !== null && !plot.contains.fullGrown()){
          plot.contains.grow();
        }
      }
    }
  }

  view.frame(timeElapsed);
  return false;
}

function activateBush(bush){
  // TODO: Make it so a bush can run out of seeds
  var plant = plants.getRandomSeed();

  if (plant === null){
    view.addMessage("Nothing found.");
  }else{
    view.addMessage("Found " + plant.name + ".");
    game.farmer.addItem(plant);
    view.drawInventory();
  }
}

function activatePlot(plot){
  game.dialog = new PlantingDialog(plot);
}

function activateShop(shop){
  game.dialog = new ShopDialog(shop);
}

// This one is called when the user presses space
function activate(){
  var nearby = visibleObjects();

  var obj;
  $("#msg").html("");
  for (var i = 0; i < nearby.length; i++){
    obj = nearby[i];

    // TODO: Use a better near() system
    if (near(obj, game.farmer.elem, game.searchRadius * 2)){
      if (obj.attr("id") == "shop"){
        activateShop(game.shop);
      }
    }
    if (near(obj, game.farmer.elem, game.searchRadius)){
      if (obj.attr("id").match(/bush/)){
        activateBush(obj);
        break;
      }else if (obj.attr("id").match(/plot/)){
        activatePlot(game.plots[obj.attr("id")]);
        break;
      }
    }
  }
}

game.plant = function(plot, plant){
  plot.contains = plant;
  plant.createSprite(
    plot.position().left + 5,
    plot.position().top - 2
  );
}

function onKeyPress(ev){
  if (game.state == "playing"){
    if (ev.which == keycodes.space){
      activate();
    }
  }else if (game.state == "paused"){
    if (ev.keyCode == keycodes.escape && game.dialog !== null){
      game.dialog.close();
    }
  }
}
