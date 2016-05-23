define(['underscore'], function(_){
  var ShaderDescription = function(){
    this.uniformList = {};
    this.attributeList = {};

    this.uniforms = {};
    this.attributes = {};
  }

  ShaderDescription.prototype = {
    addUniform: function(internalName, name){
      this.uniformList[internalName] = name;
    },

    addAttribute: function(internalName, name){
      this.attributeList[internalName] = name;
    },
    
    link: function(gl, program){
      console.log(gl, program)
      this.linkUniforms(gl, program);
      this.linkAttributes(gl, program);
    },

    linkUniforms: function(gl, program){
      var keys = _.keys(this.uniformList);
      for(var i = 0, l = keys.length; i < l; i++){
        var internalName = keys[i];
        var name = this.uniformList[internalName];
        var location = gl.getUniformLocation( program, internalName );
        
        this.uniforms[name] = location;
      }
    },

    linkAttributes: function(gl, program){
      var keys = _.keys(this.attributeList);
      for(var i = 0, l = keys.length; i < l; i++){
        var internalName = keys[i];
        var name = this.attributeList[internalName];
        var location = gl.getAttribLocation( program, internalName);
        
        this.attributes[name] = location;
      }
    }
  }

  return ShaderDescription;
})