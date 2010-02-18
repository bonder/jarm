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

function Farmer(){
  this.width = 16;
  this.height = 16;

  this.animations = {
    idle: new Animation({imageURL: "images/farmer.png"}),
    west: new Animation({imageURL: "images/walking-west.png",
      numberOfFrame: 2, type: $.gameQuery.ANIMATION_HORIZONTAL, rate: JarmView.frameRate * 10, delta: 16}),
    east: new Animation({imageURL: "images/walking-east.png",
      numberOfFrame: 2, type: $.gameQuery.ANIMATION_HORIZONTAL, rate: JarmView.frameRate * 10, delta: 16}),
    north: new Animation({imageURL: "images/walking-north.png",
      numberOfFrame: 2, type: $.gameQuery.ANIMATION_HORIZONTAL, rate: JarmView.frameRate * 10, delta: 16}),
    south: new Animation({imageURL: "images/walking-south.png",
      numberOfFrame: 2, type: $.gameQuery.ANIMATION_HORIZONTAL, rate: JarmView.frameRate * 10, delta: 16})
  };

  this.animation = this.animations.idle;

  // TODO: make more advanced inventory system
  this.inventory = [];
  this.money = 0;
  this.facing = "south";
}

Farmer.prototype.addItem = function(item){
  this.inventory.push(item);
};

Farmer.prototype.getItem = function(which){
  return this.inventory[which];
};

Farmer.prototype.removeItem = function(which){
  this.inventory.splice(which, 1);
};

Farmer.prototype.getAnimation = function(){
  return this.animation;
};

Farmer.prototype.setAnimation = function(which){
  if (this.animations[which] !== undefined){
    var animation = this.animations[which];
    if (animation != this.animation){
      this.animation = animation;
      this.elem.setAnimation(animation);
    }
  }
};

Farmer.prototype.move = function(dx, dy){
  if (dx === 0 && dy === 0){
    return false;
  }

  var offset = this.elem.position();

  if (offset.left + dx < 0){
    dx = -offset.left;
  }else if (offset.left + this.elem.width() + dx > game.background.width()){
    dx = game.background.width() - offset.left - this.elem.width();
  }

  if (offset.top + dy < 0){
    dy = -offset.top;
  }else if (offset.top + this.elem.height() + dy > game.background.height()){
    dy = game.background.height() - offset.top - this.elem.height();
  }

  var hit = false;
  var farmer = this;
  
  // TODO: pull this out into a function called collide()
  $.each(visibleObjects(), function(i, obj){
    if (hit) { return; }
    if ($.gameQueryExt.rectOverlap(offset.left + dx, offset.top + dy,
                    farmer.elem.width(), farmer.elem.height(),
                    obj.position().left, obj.position().top,
                    obj.width(), obj.height())){
      hit = true;
    }
  });

  if (!hit){
    this.elem.offset(toWindowCoords(
      {
        left: offset.left + dx,
        top: offset.top + dy
      }
    ));
    return true;
  }
  return false;
};


Farmer.prototype.eachItem = function(foo){
  $.each(this.inventory, foo);
};
