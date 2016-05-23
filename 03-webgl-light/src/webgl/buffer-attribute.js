define([], function(){
  var BufferAttribute = function(array, size){
    this.array = array;
    this.size = size;
    this.length = array.length/size;// - 1;
    this.needsUpdate = false;

    this._webglbuffer = undefined;
  }

  return BufferAttribute;
});