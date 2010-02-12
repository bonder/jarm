function JarmView(){
  $.gameQueryExt.LockedView.call(this, game.farmer, $.playground(), game.background, {
    width: game.worldSize,
    height: game.worldSize,
    imageURL: "images/grass.png"
  });

  this.frameRate = 1000 / 50;

  // update rate happens less often since it isn't necessary
  this.updateRate = 1000 / 10;

  // message queue related
  this.messages = [];
  this.msgThreshold = 3000;
  this.msgLastDraw = null;

  this.drawInventory();
}
JarmView.prototype = $.gameQueryExt.LockedView.prototype;

JarmView.prototype.update = function(){
  var now = new Date().getTime();

  if (this.msgLastDraw === null || this.msgLastDraw + 1000 < now){
    this.drawMessages();
    this.msgLastDraw = now;
  }
}

JarmView.prototype.drawMessages = function(){
  var current;
  var text = "";
  var now = new Date().getTime();

  while (this.messages.length > 5 || (this.messages.length > 0 && now - this.messages[0].timestamp > this.msgThreshold)){
    this.messages.shift();
  }

  if (this.messages.length === 0){
    $("#msg").html("").hide();
  }else{
    text = mapJoin(this.messages, "<br />", function(obj) { return obj.message; });
    $("#msg").html(text).show();
  }

}

JarmView.prototype.drawInventory = function(){
  var current;
  var text = "";

  if (game.farmer.inventory.length === 0){
    text = "<i>Nothing</i>";
  }else{
    text = mapJoin(game.farmer.inventory, "<br />", function(obj) { return obj.name; });
  }

  $("#inventory").html(text);
}

JarmView.prototype.addMessage = function(message){
  this.messages.push({
    message: message,
    timestamp: new Date().getTime()
  });
  this.drawMessages();
}
