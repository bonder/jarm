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

// TODO: Convert methods so that they accept either 1 argument which is a vector,
// or 2 arguments that are x/y coordinates
function Vector(x, y){
  this.x = x;
  this.y = y;
}

Vector.intersectRect = function(v1, v2, x, y, width, height){
  var left, right;

  if (v1.x < v2.x){
    left = v1;
    right = v2;
  }else{
    left = v2;
    right = v1;
  }

  if (v1.inRect(x, y, width, height) || v2.inRect(x, y, width, height)){
    return true;
  }else if (v1.x == v2.x){
    if (width == 0){
      return v1.x == x;
    }
    var intersectY = (-height / width) * (v1.x - x) + y;
    return intersectY >= Math.min(v1.y, v2.y) && intersectY <= Math.max(v1.y, v2.y);
  }else if (width == 0){
    var intersectY = ((left.y - right.y) / (left.x - left.y)) * (x - v1.x) + v1.y;

    return intersectY >= y && intersectY <= y + height;
  }else{
    var m1 = (right.y - left.y) / (right.x - left.x);
    var m2 = -height / width;

    if (m1 == m2){
      return left.y - m1 * left.x == y - m2 * x;
    }else{
      var intersectX = (left.y - y + m2 * x - m1 * left.x) / (m1 - m2);

      return intersectX >= left.x && intersectX <= right.x &&
             intersectX >= x && intersectX <= x + width;
    }
  }
}

Vector.prototype.times = function(v){
  return new Vector(this.x * v, this.y * v);
}

Vector.prototype.norm = function(){
  return Math.sqrt(this.x * this.x + this.y * this.y);
}
Vector.prototype.normSq = function(){
  return this.x * this.x + this.y * this.y;
}

Vector.prototype.dot = function(v){
  return this.x * v.x + this.y * v.y;
}

Vector.prototype.plus = function(x, y){
  if (y === undefined){
    y = x.y;
    x = x.x;
  }
  return new Vector(this.x + x, this.y + y);
}

Vector.prototype.minus = function(v){
  return new Vector(this.x - v.x, this.y - v.y);
}

Vector.prototype.translate = function(x, y){
  if (y === undefined){
    this.x += x.x;
    this.y += x.y;
  }else{
    this.x += x;
    this.y += y;
  }
  return this;
}

Vector.prototype.unit = function(){
  if (this.x == this.y && this.x == 0)
    return new Vector(0, 0);
  return this.times(1 / this.norm());
}

Vector.prototype.zero = function(){
  this.x = this.y = 0;
  return this;
}

/**
 * Clip a vector to be within a certain width/height.
 * Negative values are set to zero.
 */
Vector.prototype.clip = function(width, height){
  if (height === undefined){
    height = width;
  }
  if (this.x < 0){
    this.x = 0;
  }else if(this.x > width){
    this.x = width;
  }

  if (this.y < 0){
    this.y = 0;
  }else if(this.y > height){
    this.y = height;
  }
  return this;
}

Vector.prototype.isZero = function(){
  return this.x == 0 && this.y == 0;
}

Vector.prototype.clone = function(){
  return new Vector(this.x, this.y);
}

Vector.prototype.inRect = function(x, y, width, height){
  return this.x > x && this.x < x + width &&
         this.y > y && this.y < y + height;
}
