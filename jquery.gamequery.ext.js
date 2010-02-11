/*
 * gameQuery.ext
 *
 * Copyright (c) 2010 Rob Britton
 * licensed under the MIT (MIT-LICENSE.txt)
 */
$.extend($, {gameQueryExt: {}});

/* QuadTree
 * A space-partitioning tree useful for efficient collision detection.
 */
$.gameQueryExt.QuadTree = function (width, height){
  this.width = width; this.height = height;

  this.root = null;
}
$.gameQueryExt.QuadTreeNode = function(x, y, width, height){
  this.x = x; this.y = y;
  this.width = width; this.height = height;

  this.child = true;
  this.objects = [];

  this.splitSize = 5;
}

$.gameQueryExt.QuadTreeNode.prototype.add = function(obj, x, y){
  if (this.child){
    if (this.objects.length == this.splitSize){
      this.split();
      this.add(obj, x, y);
    }else{
      this.objects.push({obj: obj, x: x, y: y});
    }
  }else{
    var cx = x - this.x;
    var cy = y - this.y;

    if (cx < this.width / 2){
      if (cy < this.height / 2){
        this.children.tl.add(obj, x, y);
      }else{
        this.children.bl.add(obj, x, y);
      }
    }else{
      if (cy < this.height / 2){
        this.children.tr.add(obj, x, y);
      }else{
        this.children.br.add(obj, x, y);
      }
    }
  }
}
$.gameQueryExt.QuadTreeNode.prototype.split = function(){
  this.child = false;
  this.children = {
    tl: new $.gameQueryExt.QuadTreeNode(this.x, this.y, this.width / 2, this.height / 2),
    tr: new $.gameQueryExt.QuadTreeNode(this.x + this.width / 2, this.y, this.width / 2, this.height / 2),
    bl: new $.gameQueryExt.QuadTreeNode(this.x, this.y + this.height / 2, this.width / 2, this.height / 2),
    br: new $.gameQueryExt.QuadTreeNode(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, this.height / 2),
  }

  for (var i = 0; i < this.objects.length; i++){
    var obj = this.objects[i];
    this.add(obj.obj, obj.x, obj.y);
  }
  delete this.objects;
}
$.gameQueryExt.QuadTreeNode.prototype.get = function(x, y, width, height){
  if (this.child){
    if (!rectOverlap(this.x, this.y, this.width, this.height, x, y, width, height)){
      return null;;
    }else{
      return $.map(this.objects, function(obj, i) { return obj.obj; });
    }
  }else{
    var ret = [];
    var next;

    for (var i in this.children){
      if ((next = this.children[i].get(x, y, width, height)) !== null)
      $.merge(ret, next);
    }
    return ret;
  }
}

$.gameQueryExt.QuadTree.prototype.add = function(obj, x, y){
  if (!this.root){
    this.root = new $.gameQueryExt.QuadTreeNode(0, 0, this.width, this.height);
  }
  this.root.add(obj, x, y);
}
$.gameQueryExt.QuadTree.prototype.get = function(x, y, width, height){
  if (!this.root)
    return [];
  return this.root.get(x, y, width, height);
}

