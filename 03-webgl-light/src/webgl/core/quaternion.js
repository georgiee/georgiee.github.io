define(['vendor/gl-matrix'], function(glmatrix){
  var quat = glmatrix.quat;
  var mat4 = glmatrix.mat4;
  var vec4 = glmatrix.vec4;

  var Quaternion = function ( x, y, z, w ) {
    this.quat = vec4.fromValues( x || 0, y || 0, z || 0, w !== undefined ? w : 1 );
  };

  Quaternion.prototype = {

    constructor: Quaternion,
    
    getRotationMatrix: function(){
      return mat4.fromQuat([], this.quat);
    },
    
    setAxisAngle: function(axis, angle){
      var tmp = quat.create();
      quat.setAxisAngle(tmp, axis, angle);
      quat.multiply(this.quat, this.quat, tmp);
      //quat.setAxisAngle(this.quat, axis, angle);
    },

    get x () { return this.quat[0]; },
    set x ( value ) { this.quat[0] = value; },

    get y () { return this.quat[1]; },
    set y ( value ) { this.quat[1] = value; },
    
    get z () { return this.quat[2]; },
    set z ( value ) { this.quat[2] = value; },

    get w () { return this.quat[3]; },
    set w ( value ) { this.quat[3] = value; }
  }

  return Quaternion;
})