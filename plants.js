function Plant(type, name, animation){
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
  this.animation = animation;
}
Plant.num = 0;
Plant.prototype.grow = function(){
  if (this.growth < 1000){
    this.growth++;
    if (this.growth % (1000 / this.animation.numFrames) == 0){
      this.nextFrame();
    }
  }
}
Plant.prototype.fullGrown = function(){
  return this.growth == 1000;
}
Plant.prototype.nextFrame = function(){
  if (this.animation.frame < this.animation.numFrames){
    this.elem.css("backgroundPosition", "-" + (this.animation.frame * this.animation.delta) + "px 0px");
    this.animation.frame++;
  }
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
      return new Plant("marijuana");
    }else if (which >= 96){
      return new Plant("rose");
    /*}else if (which >= 91){
       return plants.apple();*/
    }else if (which >= 86){
      return new Plant("banana",
        "banana seeds",
        {
          height: 50,
          offsetY: -30
        }
      );
    }else if (which >= 81){
      return new Plant("carrot");
    }else if (which >= 76){
      return new Plant("cabbage");
    }else{
      return null;
    }
  },

  // Plant types
  apple: function(){
    return {
      type: 'apple',
      name: 'apple seeds'
    };
  },

  banana: function(){
    return {
      type: 'banana',
      name: 'banana seeds'
    };
  },

  carrot: function(){
    return {
      type: 'carrot',
      name: 'carrot seeds'
    };
  },

  cabbage: function(){
    return {
      type: 'cabbage',
      name: 'cabbage seeds'
    };
  },

};
