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
      return plants.marijuana();
    }else if (which >= 96){
      return plants.rose();
    }else if (which >= 91){
      return plants.apple();
    }else if (which >= 86){
      return plants.banana();
    }else if (which >= 81){
      return plants.carrot();
    }else if (which >= 76){
      return plants.cabbage();
    }else{
      return null;
    }
  },

  // Plant types
  marijuana: function(){
    return {
      type: 'marijuana',
      name: 'marijuana seeds'
    };
  },

  rose: function(){
    return {
      type: 'rose',
      name: 'rose seeds'
    };
  },

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
