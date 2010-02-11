function PlantingDialog(){
  game.state = "paused";
  this.dlg = $("#planting-dlg");

  this.dlg
    .show();
}

PlantingDialog.prototype.close = function(){
  game.state = "playing";
  this.dlg.hide();
}
