var distSq = function(pos1, pos2){
  return (pos1.top - pos2.top) * (pos1.top - pos2.top) +
    (pos1.left - pos2.left) * (pos1.left - pos2.left);
}

var near = function(obj1, obj2, radius){
  var centre1 = obj1.position();
  centre1.left += obj1.width() / 2;
  centre1.top += obj1.height() / 2;
  var centre2 = obj2.position();
  centre2.left += obj2.width() / 2;
  centre2.top += obj2.height() / 2;

  return distSq(centre1, centre2) <= radius * radius;
}


