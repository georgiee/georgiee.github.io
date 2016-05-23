define(['core/object3d', 'vendor/gl-matrix'], function(Object3D, glmatrix){
  var mat4 = glmatrix.mat4;

  var Camera = function(){
    this.__super__.constructor.call(this);
  }
  
  Camera.prototype = Object.create(Object3D.prototype);
  Camera.prototype.__super__ = Object3D.prototype;
  Camera.prototype.constructor = Camera;

  Camera.prototype.getViewMatrix = function(){
    this.updateMatrix();
    var viewMatrix = mat4.invert([], this.matrix);
    return viewMatrix;
  }

  return Camera;
})