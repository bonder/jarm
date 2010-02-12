function PlantingDialog(plot){
  game.state = "paused";

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
  this.dlg = $("#planting-dlg")
    .children(".dlg-content")
      .html(text)
      .end()
    .show();
}

PlantingDialog.prototype.plant = function(which){
  var plant = game.farmer.inventory.splice(which, 1);
  plant = plant[0];

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

PlantingDialog.prototype.close = function(){
  game.state = "playing";
  this.dlg.hide();
}
