define([], function(){
  function BufferGeometry(){
    this.attributes = [];
    this.attributeKeys = [];
  }

  BufferGeometry.prototype = {
    addAttribute: function(name, attribute){
      this.attributes[name] = attribute;
      this.attributeKeys = Object.keys(this.attributes);
    }  
  }

  return BufferGeometry;
});