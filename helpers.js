function scrollBackground(dx, dy){
  var pos = this.position();
  var x = dx - pos.left;
  var y = dy - pos.top;

  var playground = $.playground();
  if (x < 0)
    x = 0;
  else if (x + playground.width() >= this.width())
    x = this.width() - playground.width();

  if (y < 0)
    y = 0;
  else if (y + playground.height() >= this.height())
    y = this.height() - playground.height();

  var offset = this.offset();
  var position = this.position();
  this.offset({left: offset.left - position.left - x, top: offset.top - position.top - y});
  return this;
}

function setBackground(elem, options){
  // backgrounds repeat
  var background = $(elem);

  $.extend({
    width: background.width(),
    height: background.height()
  }, options);

  background.css(
    {
      backgroundRepeat: "repeat",
      backgroundPosition: "0px 0px",
      backgroundImage: "url(" + options.imageURL + ")",
      width: options.width + "px",
      height: options.height + "px"
    }
  );

  // add some handy methods
  background.scrollBackground = scrollBackground;

  return background;
}

function rectOverlap(x1, y1, w1, h1, x2, y2, w2, h2){
  if ((x1 + w1 >= x2) &&
      (y1 + h1 >= y2) &&
      (x1 <= x2 + w2) &&
      (y1 <= y2 + h2))
    return true;
  return false;
}

function dist_sq(pos1, pos2){
  return (pos1.top - pos2.top) * (pos1.top - pos2.top) +
    (pos1.left - pos2.left) * (pos1.left - pos2.left);
}

function near(obj1, obj2, radius){
  var centre1 = obj1.position();
  centre1.left += obj1.width() / 2;
  centre1.top += obj1.height() / 2;
  var centre2 = obj2.position();
  centre2.left += obj2.width() / 2;
  centre2.top += obj2.height() / 2;

  return dist_sq(centre1, centre2) <= radius * radius;
}

function keyDown(what){
  return $.gameQuery.keyTracker[$.keycodes[what]];
}

$.keycodes = {
  backspace:  8,
  tab:        9,
  enter:     13,
  shift:     16,
  ctrl:      17,
  alt:       18,
  pause:     19,
  caps:      20,
  escape:    27,
  space:     32,
  pageup:    33,
  pagedown:  34,
  end:       35,
  home:      36,
  left:      37,
  up:        38,
  right:     39,
  down:      40,
  insert:    45,
  del:       46
}

for (var i = 48; i <= 57; i++){
  $.keycodes[String.fromCharCode(i)] = i;
}
for (var i = 65; i <= 90; i++){
  $.keycodes[String.fromCharCode(i)] = i;
}
for (var i = 0; i <= 9; i++){
  $.keycodes["num" + i] = i + 96;
}
for (var i = 1; i <= 12; i++){
  $.keycodes["f" + i] = i + 111;
}

function getTimeElapsed(){
  if (getTimeElapsed.lastFrame === undefined)
    getTimeElapsed.lastFrame = new Date();

  var currentTime = new Date();
  var gap = new Date();
  gap.setTime(currentTime.getTime() - getTimeElapsed.lastFrame.getTime());
  getTimeElapsed.lastFrame = currentTime;
  return gap.getMilliseconds();
}
