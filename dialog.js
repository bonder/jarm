function PlantingDialog(plot){
  game.state = "paused";

  var text;
  if (plot.contains !== null){
    text = "This plot contains a " + plot.contains.type + " plant.";
  }else if (game.farmer.inventory.length === 0){
    text = "You have nothing to plant.";
  }else{
    text = "This plot is empty. What would you like to plant?<br />";

    text += mapJoin(game.farmer.inventory, "<br />", function(obj, i){
      return '<a href = "#" onclick = "game.dialog.plant(' + i + '); return false">' +
        obj.name + '</a>';
    });
    
    text += '<br /><a href = "#" onclick = "game.dialog.close()">Nothing</a>';
  }

  this.plot = plot;
  this.dlg = $("#planting-dlg")
    .children(".dlg-content")
      .html(text)
      .end()
    .show();
}

PlantingDialog.prototype.plant = function(which){
  var plant = game.farmer.inventory.splice(which, which + 1);
  plant = plant[0];

  game.plant(this.plot, plant);
  drawInventory();
  this.close();
}

PlantingDialog.prototype.close = function(){
  game.state = "playing";
  this.dlg.hide();
}
