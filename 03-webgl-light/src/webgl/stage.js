define(['core/timer', 'core/loader', 'core/webgl-renderer', 'core/webgl-program', 'shader-description','model-3d', 'texture','vendor/gl-matrix', 'debugPanel', 'core/camera', '../debug/stats-instance'], function(Timer, Loader, WebGLRenderer, WebglProgram, ShaderDescription, Model3D, Texture, glmatrix, debugPanel, Camera, stats){

  var mat4 = glmatrix.mat4;
  var vec3 = glmatrix.vec3;

  var Stage = function(canvas, width, height){
    this.canvas = canvas;
    this.width = width;

    this.timer = new Timer(this.render, this);
    this.loader = new Loader(this.create, this);
    this.renderer = new WebGLRenderer(this.canvas);
    this.objects = [];

    this.mvMatrix = mat4.create();
    this.mvMatrixStack = [];

    this.tempDelta = 0;

    this.run();
  }

  Stage.prototype = {
    add: function(object){
      this.objects = [object];
    },
    
    preload: function(){
      this.loader.loadImages(['assets/UV_Grid_Sm.jpg'])
      
      this.loader.loadOBJ({
        'tree': 'assets/models/tree.obj',
        'cube': 'assets/models/cube.obj',
        'sphere': 'assets/models/sphere.obj'
      })
      

      this.loader.loadShaders([{
        id: 'default',
        fragment: 'src/shaders/default.fragment',
        vertex: 'src/shaders/default.vertex'
      },
      
      {
        id: 'light',
        fragment: 'src/shaders/light.fragment',
        vertex: 'src/shaders/light.vertex'
      },
      
      {
        id: 'simple-texture',
        fragment: 'src/shaders/simple-texture.fragment',
        vertex: 'src/shaders/simple-texture.vertex'
      }]);
    },

    create: function(){
      this.createShader();
      this.objects = [];
      
      this.camera = new Camera();
      this.camera.camera = true;
      this.camera.z = 100;

      var debugCamera = debugPanel.registerModel(this.camera, 'Camera', true);
      debugCamera.params.circleAround = 0;
      debugCamera.folder.add(debugCamera.params, 'circleAround', 0, 1).listen();
      
      this.debugCamera = debugCamera;
      this.camera.offsets = debugCamera.params;


      var image = this.loader.getImage('assets/UV_Grid_Sm.jpg');
      var mesh = this.loader.getMesh('cube');
      var texture = new Texture({image: image});

      var cube = new Model3D(mesh, texture);
      
      cube.offsets = debugPanel.registerModel(cube, 'Cube').params;
      cube.scaleXYZ = 30;
      cube.rotationY = 30 * Math.PI/180;

      this.cube = cube;
      this.objects.push(cube);


      var minicube = new Model3D(mesh, texture);
      this.minicube = minicube;
      this.objects.push(minicube);


      cube.y = 50;
      mesh = this.loader.getMesh('tree');
      var tree = new Model3D(mesh, texture);
      tree.offsets = debugPanel.registerModel(tree, 'Tree').params;
      tree.y = -70
      tree.scaleXYZ = 90;
      this.tree = tree;
      this.objects.push(tree);
      
      this.timer.start();
    },
    
    addObject: function(){

    },

    createShader: function(){
      var gl = this.renderer.getContext();
      var shaderSources = this.loader.getShader('light');
      var webglProgramInfo = new WebglProgram(gl, shaderSources.vertex, shaderSources.fragment);
      
      var shader = new ShaderDescription();
      shader.addUniform('uModelViewMatrix', 'modelViewMatrix');
      shader.addUniform('uNormalMatrix', 'normalMatrix');
      shader.addUniform('uTexture', 'texture');

      shader.addUniform('uUseLighting', 'useLighting');
      shader.addUniform('uAmbientColor', 'ambientColor');
      shader.addUniform('uDirectionalColor', 'directionalColor');
      shader.addUniform('uLightingDirection', 'lightingDirection');

      shader.addAttribute('aPosition', 'position');
      shader.addAttribute('aUV', 'uv');
      shader.addAttribute('aNormal', 'normal');
      
      gl.useProgram(webglProgramInfo.program);
      
      shader.link(gl, webglProgramInfo.program);
      this.shader = shader;

      gl.enableVertexAttribArray( this.shader.attributes.position );
      gl.enableVertexAttribArray( this.shader.attributes.uv );
      gl.enableVertexAttribArray( this.shader.attributes.normal );


      console.log(this.shader)
    },

    updateBuffers: function(geometry){
      var gl = this.renderer.getContext();

      var attributes = geometry.attributes;
      var attributesKeys = geometry.attributeKeys;

      for ( var i = 0, l = attributesKeys.length; i < l; i ++ ) {
        var key = attributesKeys[ i ];
        var attribute = attributes[ key ];

        if(attribute.buffer === undefined){
          attribute.buffer = gl.createBuffer();   
          attribute.needsUpdate = true;
        }

        if ( attribute.needsUpdate === true ) {
          var bufferType = ( key === 'index' ) ? gl.ELEMENT_ARRAY_BUFFER : gl.ARRAY_BUFFER;
          gl.bindBuffer(bufferType, attribute.buffer);
          gl.bufferData(bufferType, attribute.array, gl.STATIC_DRAW);
          attribute.needsUpdate = false;
        }
      }
    },

    uploadTexture: function(texture){
      var gl = this.renderer.getContext();
      
      if ( texture.needsUpdate ) {
        if ( texture.__webglInit === undefined ) {
          texture.__webglInit = true;
          texture.__webglTexture = gl.createTexture();
        }
        gl.bindTexture( gl.TEXTURE_2D, texture.__webglTexture );
        
        gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, texture.flipY );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
        
        var glFormat = gl.RGBA;
        var glType = gl.UNSIGNED_BYTE;
        gl.texImage2D(gl.TEXTURE_2D, 0, glFormat, glFormat, glType, texture.image);
        gl.generateMipmap(gl.TEXTURE_2D);
        texture.needsUpdate = false;
      
      } else {
        
        gl.bindTexture( gl.TEXTURE_2D, texture.__webglTexture );
      
      }
    },
    
    renderObject: function(model){
      this.updateObject(model);

      var gl = this.renderer.getContext();
      var geometry = model.geometry;
      
      gl.uniform1i(this.shader.uniforms.texture, 0);


      gl.bindBuffer( gl.ARRAY_BUFFER, geometry.attributes.uv.buffer );
      gl.vertexAttribPointer( this.shader.attributes.uv, geometry.attributes.uv.size, gl.FLOAT, false, 0, 0 );

      gl.bindBuffer( gl.ARRAY_BUFFER, geometry.attributes.position.buffer );
      gl.vertexAttribPointer( this.shader.attributes.position, geometry.attributes.position.size, gl.FLOAT, false, 0, 0 );

      gl.bindBuffer( gl.ARRAY_BUFFER, geometry.attributes.normal.buffer );
      gl.vertexAttribPointer( this.shader.attributes.normal, geometry.attributes.normal.size, gl.FLOAT, false, 0, 0 );

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.attributes.index.buffer);
      gl.drawElements(gl.TRIANGLES, geometry.attributes.index.length, gl.UNSIGNED_SHORT, 0);
    },

    updateObject: function(model){
      this.uploadTexture(model.texture);
      this.updateBuffers(model.geometry);
    },

    mvPushMatrix: function(){
      var copy = mat4.clone(this.mvMatrix);
      this.mvMatrixStack.push(copy);
    },
    
    mvPopMatrix: function(){
      if (this.mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
      }

      this.mvMatrix = this.mvMatrixStack.pop();
    },


    render: function(){
      stats.begin();

      var gl = this.renderer.getContext();
      
      this.renderer.clear();
      gl.viewport( 0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

      var projectionMatrix = mat4.perspective([], 45, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 2000.0);


      //reset
      mat4.identity(this.mvMatrix);
      var cameraViewMatrix = this.camera.getViewMatrix();

      var deg2Rad = Math.PI/180;

      gl.uniform1i(this.shader.uniforms.useLighting, debugPanel.params.light.active);
      //gl.uniform3fv(this.shader.uniforms.lightingDirection, [1,1,1]);
      
      var lightingDirection = vec3.fromValues(debugPanel.params.light.x, debugPanel.params.light.y, debugPanel.params.light.z);
      vec3.normalize(lightingDirection, lightingDirection);
      vec3.scale(lightingDirection, lightingDirection, -1);

      gl.uniform3fv(this.shader.uniforms.lightingDirection, lightingDirection);
      
      var ambientColor = debugPanel.params.light.ambientColor;
      gl.uniform3fv(this.shader.uniforms.ambientColor, vec3.scale([], ambientColor, 1/255));

      var lightColor = debugPanel.params.light.lightColor;
      gl.uniform3fv(this.shader.uniforms.directionalColor, vec3.scale([], lightColor, 1/255));

      //move to light origin
      this.minicube.scaleXYZ = 5;
      var pos = vec3.scale([], lightingDirection, 100);
      this.minicube.x = pos[0];
      this.minicube.y = pos[1];
      this.minicube.z = pos[2];


      var delta = this.debugCamera.params.circleAround * Math.PI * 2
        this.camera.x = Math.sin(delta) * 200;
        this.camera.z = Math.cos(delta) * 200;

      if(this.debugCamera.params.circleAround > 0){
        
        //var lookAtCenter = mat4.lookAt([], this.camera.position, [0,0,0], [0,1,0]);
        //
        lookAtCenter = mat4.lookAt([], this.camera.position, [0,0,0], [0,1,0]);
        this.camera.updateMatrix();

        var merged = mat4.multiply([], this.camera.matrix, lookAtCenter) ;
        cameraViewMatrix = lookAtCenter;
      }

      //this.camera.lookAt(this.cube.position);

      for(var i = 0, l = this.objects.length; i < l;i++){
        this.mvPushMatrix();

        var model3D = this.objects[i];
        var viewMatrix = this.mvMatrix;
        
        model3D.updateMatrix();
        this.cube.rotateX(deg2Rad*0.251);
        
        //world space (positioning of object in world)
        mat4.multiply(viewMatrix, viewMatrix, model3D.matrix);
        
        //normal matrix from world space
        var normalMatrix = glmatrix.mat3.normalFromMat4([], viewMatrix);

        //camera space (as seen from camera)
        mat4.multiply(viewMatrix, cameraViewMatrix, viewMatrix);

        //projection into clip space -1/1
        mat4.multiply(viewMatrix, projectionMatrix, viewMatrix);
        
        //write to use in vertex shader
        gl.uniformMatrix4fv(this.shader.uniforms.modelViewMatrix, gl.FALSE, viewMatrix);
        gl.uniformMatrix3fv(this.shader.uniforms.normalMatrix, gl.FALSE, normalMatrix);
        
        //finally render object
        this.renderObject(model3D);

        this.mvPopMatrix();
      }

      
      stats.end();
    },

    run: function(){
      this.preload();
    }
  }

  return Stage;
});

