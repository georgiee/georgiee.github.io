define(['vendor/gl-matrix', 'buffer-attribute', 'buffer-geometry','core/object3d'], function(glmatrix, BufferAttribute, BufferGeometry, Object3D){
  var Model3D = function(mesh, texture){
    this.__super__.constructor.call(this);

    this.texture = texture;
    this.rotationScalar = 0;

    this.geometry = this.buildGeometryBuffer(mesh);
  }
  Model3D.prototype = Object.create(Object3D.prototype);
  Model3D.prototype.__super__ = Object3D.prototype;
  Model3D.prototype.constructor = Model3D;


  Model3D.prototype.buildGeometryBuffer = function(mesh){
    var geometry = new BufferGeometry();
    geometry.addAttribute('position', new BufferAttribute(new Float32Array(mesh.vertices), 3));
    geometry.addAttribute('uv', new BufferAttribute(new Float32Array(mesh.textures), 2));
    geometry.addAttribute('index', new BufferAttribute(new Uint16Array(mesh.indices), 1));
    geometry.addAttribute('normal', new BufferAttribute(new Float32Array(mesh.vertexNormals), 3));

    return geometry;
  }

    

  return Model3D;
})