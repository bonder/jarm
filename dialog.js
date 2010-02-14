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
function Dialog(){
  game.state = "paused";

  this.dlg = $("#dialog")
    .children(".dlg-content")
      .end()
    .show();
}
Dialog.prototype.close = function(){
  game.state = "playing";
  this.dlg.hide();
};
Dialog.prototype.setContent = function(html){
  this.dlg.children(".dlg-content").html(html);
};

function PlantingDialog(plot){
  Dialog.call(this);

  var text;
  if (plot.contains !== null){
    text = "This plot contains a " + plot.contains.type + " plant.<br />";

    if (plot.contains.fullGrown()){
      text += '<a href = "#" onclick = "game.dialog.pick(\'' + plot.attr("id") + '\'); return false">Pick It</a>';
    }else{
      text += "When it is full grown you will be able to pick it.";
    }
  }else{
    // find something to plant
    text = "This plot is empty. What would you like to plant?<br />";

    var found = false;
    var obj;
    for (var i = 0; i < game.farmer.inventory.length; i++){
      obj = game.farmer.inventory[i];
      if (obj.name.match(/seed/)){
        found = true;
        text += '<a href = "#" onclick = "game.dialog.plant(' + i + '); return false">' +
          obj.name + '</a><br />';
      }
    }
    
    if (!found){
      text = "You have nothing to plant. Find some seeds!";
    }else{
      text += '<a href = "#" onclick = "game.dialog.close(); return false">Nothing</a>';
    }
  }

  this.plot = plot;
  this.setContent(text);
}
PlantingDialog.prototype = Dialog.prototype;

PlantingDialog.prototype.plant = function(which){
  var plant = game.farmer.inventory[which];

  if (!plant.name.match(/seed/)){
    console.log("Error: tried to plant non-seed");
    return;
  }
  game.farmer.inventory.splice(which, 1);

  game.plant(this.plot, plant);
  view.drawInventory();
  this.close();
}

PlantingDialog.prototype.pick = function(which){
  var plot = game.plots[which];

  game.farmer.inventory.push(plot.contains);
  plot.contains.removeSprite();
  plot.contains = null;
  view.drawInventory();
  this.close();
}

function ShopDialog(shop){
  Dialog.call(this);

  var text = "";
  var found = false;
  var obj;
  for (var i = 0; i < game.farmer.inventory.length; i++){
    obj = game.farmer.inventory[i];
    if (!obj.name.match(/seed/)){
      found = true;
      text += '<a href = "#" onclick = "game.dialog.sell(' + i + '); return false">' +
        obj.name + '</a><br />';
    }
  }
  
  if (!found){
    text = "You have nothing to sell. Grow some plants!";
  }else{
    text = "What would you like to sell?<br />" +
      text +
      '<a href = "#" onclick = "game.dialog.close(); return false">Nothing</a>';
  }

  this.shop = shop;
  this.setContent(text);
}
ShopDialog.prototype = Dialog.prototype;

ShopDialog.prototype.sell = function(index){
  var obj = game.farmer.inventory[index];

  // TODO: make it so you can sell seeds
  if (obj.name.match(/seed/)){
    console.log("Error: tried to sell seed");
  }
  game.farmer.inventory.splice(index, 1);

  this.shop.sell(obj);
  view.drawInventory();
  this.close();
}
