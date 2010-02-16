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
function Plant(type, name, animation){
  if (type !== undefined){
    if (name === undefined){
      name = type + " seeds";
    }
    if (animation === undefined){
      animation = {};
    }

    animation = $.extend({
      frame: 0,
      numFrames: 4,
      imageURL: "images/" + type + ".png",
      delta: 20,
      offsetX: 0,
      offsetY: 0,
      height: 20,
      width: 20
    }, animation);

    this.type = type;
    this.name = name;

    this.growth = 0;
    this.growTime = 1000;
    this.animation = animation;
  }
}
Plant.num = 0;
Plant.prototype.grow = function(){
  if (this.growth < this.growTime){
    this.growth++;
    if (this.growth % Math.floor(this.growTime / (this.animation.numFrames - 1)) == 0){
      this.nextFrame();
    }
  }
}
Plant.prototype.fullGrown = function(){
  return this.growth >= Math.floor(this.growTime / (this.animation.numFrames - 1)) * (this.animation.numFrames - 1);
}
Plant.prototype.isSeed = function(){
  return this.name.match(/(seed|baby)/);
}
Plant.prototype.nextFrame = function(){
  if (this.animation.frame < this.animation.numFrames){
    this.elem.css("backgroundPosition", "-" + (this.animation.frame * this.animation.delta) + "px 0px");
    this.animation.frame++;

    if (this.fullGrown()){
      this.growUp();
    }
  }
}
Plant.prototype.growUp = function(){
  this.name = this.name.replace(" seeds", "");
}
Plant.prototype.createSprite = function(x, y){
  var num = ++Plant.num;

  this.animation.frame = 1;
  if (y === undefined){
    y = x.top;
    x = x.left;
  }
  $.playground().addSprite("plant" + num, {
    posx: x + this.animation.offsetX,
    posy: y + this.animation.offsetY,
    width: this.animation.width,
    height: this.animation.height
  });
  this.elem = $("#plant" + num);
  this.elem.css({
    backgroundImage: "url(" + this.animation.imageURL + ")"
  });
}
Plant.prototype.removeSprite = function(){
  this.elem.remove();
}

function Marijuana(){
  Plant.call(this, "marijuana", "marijuana seeds", {
    offsetY: -2
  });
  this.value = 100;
}
Marijuana.prototype = Plant.prototype;

function Rose(){
  Plant.call(this, "rose");
  this.value = 20;
}
Rose.prototype = Plant.prototype;

function Banana(){
  Plant.call(this, "banana", "banana seeds", {
    height: 40,
    offsetY: -24
  });
  this.value = 5;
}
Banana.prototype = Plant.prototype;

function Apple(){
  Plant.call(this, "apple", "apple seeds", {
    height: 27,
    offsetY: -10
  });
  this.value = 5;
}
Apple.prototype = Plant.prototype;

function Cactus(){
  Plant.call(this, "cactus", "cactus seeds", {
    height: 32,
    offsetY: -15
  });
  this.value = 5;
}
Cactus.prototype = Plant.prototype;

function Carrot(){
  Plant.call(this, "carrot");
  this.value = 5;
}
Carrot.prototype = Plant.prototype;

function Cabbage(){
  Plant.call(this, "cabbage");
  this.value = 5;
}
Cabbage.prototype = Plant.prototype;

function Mushroom(){
  Plant.call(this, "mushroom", "baby mushrooms");
  this.value = 5;
}
Mushroom.prototype = new Plant();
Mushroom.prototype.growUp = function(){
  this.name = this.name.replace(/baby /, "");
}

var plants = {
  maxNum: 100,

  getRandomSeed: function(){
    return plants.getSeed(Math.floor(Math.random() * plants.maxNum));
  },

  getSeed: function(which){
    if (which < 0 || which >= plants.maxNum){
      console.log("Plant fetch out of bounds.");
      return null;
    }

    if (which >= 98){
      return new Marijuana();
    }else if (which >= 96){
      return new Rose();
    }else if (which >= 91){
       return new Apple();
    }else if (which >= 86){
      return new Banana();
    }else if (which >= 81){
      return new Carrot();
    }else if (which >= 76){
      return new Cabbage();
    }else if (which >= 71){
      return new Cactus();
    }else if (which >= 66){
      return new Mushroom();
    }else{
      return null;
    }
  }
};
