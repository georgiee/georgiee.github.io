define([], function(){
  function WebGLProgram(gl, vertexSource, fragmentSource){
    this.attributes = [];
    this.uniforms = [];

    var createShader = function(type, source){
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      var status = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if(!status){
        alert('shader compiler error', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
      }

      return shader;
    }
    
    var vertexShader = createShader(gl.VERTEX_SHADER, vertexSource);
    var fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    
    gl.linkProgram( program );

    var ii;
    var numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (ii = 0; ii < numUniforms; ++ii) {
      var info = gl.getActiveUniform(program, ii);
      console.log('getActiveUniform', info);
    }

    var numAttribs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
    for (ii = 0; ii < numAttribs; ++ii) {
      var info = gl.getActiveAttrib(program, ii);
      console.log(info);
    }

    console.log('numUniforms', numUniforms);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("Could not initialise webgl program");
    }

    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.program = program;
  }

  return WebGLProgram;
})