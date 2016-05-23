define(['vendor/gl-matrix', 'core/quaternion'], function(glmatrix, Quaternion){
  var mat4 = glmatrix.mat4;
  var vec3 = glmatrix.vec3;
  var quat = glmatrix.quat;

  var Object3D = function(){
    this.position = glmatrix.vec3.create();
    this.scale = glmatrix.vec3.fromValues(1,1,1);
    this.rotation = glmatrix.vec3.create();
    
    this.quaternion = new Quaternion();
    

    this.matrix = mat4.create();
  }
  
  Object3D.prototype = {
    
    constructor: Object3D,

    get x () { return this.position[0]; },
    set x ( value ) { this.position[0] = value; },

    get y () { return this.position[1]; },
    set y ( value ) { this.position[1] = value; },
    
    get z () { return this.position[2]; },
    set z ( value ) { this.position[2] = value; },

    //convenience
    get scaleXYZ () { return this.scale[0]; },
    set scaleXYZ ( value ) { this.scale[0] = this.scale[1] = this.scale[2] = value; },

    get rotationX () { return this.rotation[0]; },
    set rotationX ( value ) {
      this.rotation[0] = value;
      this.rotateX(value);
    },

    get rotationY () { return this.rotation[1]; },
    set rotationY ( value ) {
      this.rotation[1] = value;
      this.rotateY(value);
    },

    get rotationZ () { return this.rotation[2]; },
    set rotationZ ( value ) {
      this.rotation[2] = value;
      this.rotateZ(value);
    },

    rotateX: function(angle){
      this.quaternion.setAxisAngle([1,0,0], angle);
    },
    rotateY: function(angle){
      this.quaternion.setAxisAngle([0,1,0], angle);
    },
    rotateZ: function(angle){
      this.quaternion.setAxisAngle([0,0,1], angle);
    },

    updateMatrix: function(){
      mat4.identity(this.matrix);
      var degToRad = Math.PI/180;
      var position = vec3.clone(this.position);
      
      var quaternion = quat.clone(this.quaternion.quat);
      var scale = vec3.clone(this.scale);

      if(this.offsets){
        vec3.add(position, position, [this.offsets.x, this.offsets.y, this.offsets.z]);
        
        if(this.offsets.scale){
          vec3.add(scale, scale, [this.offsets.scale, this.offsets.scale, this.offsets.scale]);
        }

        var q = quat.create();
        quat.rotateX(q, q, this.offsets.rotationX * degToRad);
        quat.rotateY(q, q, this.offsets.rotationY * degToRad);
        quat.rotateZ(q, q, this.offsets.rotationZ * degToRad);
        
        quat.multiply(quaternion, quaternion, q);
      }

      


      //mat4.translate(this.matrix, this.matrix, position);
      
      //var quatMat = this.quaternion.getRotationMatrix();
      //mat4.multiply(this.matrix, this.matrix, quatMat);

      //replaced by a single quaternion matrix multiplication
      //mat4.rotateX(this.matrix, this.matrix, rotation[0]);
      //mat4.rotateY(this.matrix, this.matrix, rotation[1]);
      //mat4.rotateZ(this.matrix, this.matrix, rotation[2]);
      
      //v1
      mat4.fromRotationTranslation(this.matrix, quaternion, position);
      mat4.scale(this.matrix, this.matrix, scale);
      
      //v2
      /*
      
      mat4.fromQuat(this.matrix, quaternion);
      mat4.scale(this.matrix, this.matrix, scale);
      
      this.matrix[ 12 ] = position[0];
      this.matrix[ 13 ] = position[1];
      this.matrix[ 14 ] = position[2];
      */
      
      //v3 - patche glmatrix
      //mat4.fromTranslationRotationScale(this.matrix, position, quaternion, scale);

      //mat4.translate(this.matrix, this.matrix, position);
    }
  }

  return Object3D;
})