define([], function(){
  var WebGLRenderer = function(canvas){
    var gl = canvas.getContext('webgl', { alpha: false });
    
    var _this = this,
      _context = gl,
      _canvas = canvas,
      _viewportWidth = _canvas.clientWidth,
      _viewportHeight = _canvas.clientHheight;

    var setContextDefaults = function(){
      gl.clearColor(0,0,0,1.0);
      gl.enable(gl.DEPTH_TEST);
      //gl.enable(gl.CULL_FACE);
      gl.viewport(0,0,_viewportWidth,_viewportHeight);
    }
    
    setContextDefaults();

    this.getContext = function(){
      return _context;
    }
    
    this.clear = function(){
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }
  }

  return WebGLRenderer;
});