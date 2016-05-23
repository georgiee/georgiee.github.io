define([], function(){
  var Texture = function(options){
    var options = options || {};
    this.image = options.image;

    this.flipY = true;
    this.needsUpdate = true;
  }

  return Texture;
})