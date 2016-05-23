define(['vendor/q','vendor/webgl-obj-loader'], function(Q, OBJ){
  function Loader(callback, context){
    
    var _this = this,
      _callback = callback,
      _context = context,
      _images = [],
      _shaders = [],
      _queueLength = 0,
      _meshes;

    this.loadOBJ = function(meshes){
      _queueLength += 1;

      OBJ.downloadMeshes(meshes, function(meshes){
        _meshes = meshes;
        _this.nextQueue();
      });
    },
    
    this.getMesh = function(id){
      return _meshes[id];
    }

    this.loadImages = function(urls){
      _queueLength+= urls.length;

      for(var i = 0; i<urls.length;i++){
        var src = urls[i];
        var image = new Image();

        image.onload = function(){
          _images[src] = image;
          _this.nextQueue();
        }
        image.src = src;
      }
    },

    this.getImage = function(url){
      return  _images[url];
    }
    
    var loadText = function(url){
      var deferred = Q.defer();

      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.send();  
      
      xhr.onload = function(e){
        if (xhr.status == 200){
          deferred.resolve(xhr.responseText);
        }else{
          deferred.reject(new Error("Error Loading Text file:", url));
        }
      }
      
      return deferred.promise;
    }
    this.loadShaders = function(list){
      for(var i=0, l=list.length;i<l;i++){
        this.loadShader(list[i]);
      }
    },

    this.loadShader = function(options){
      _queueLength += 1;

      Q.all([
        loadText(options.vertex),
        loadText(options.fragment)
      ]).spread(function(vertexSource, fragmentSource){
        _shaders[options.id] = {
          vertex: vertexSource,
          fragment: fragmentSource
        }

        _this.nextQueue()
      })
    }
    
    this.getShader = function(id){
      return _shaders[id]
    },

    this.nextQueue = function(){
      _queueLength--;
      if(_queueLength == 0){
        _callback.call(_context);
      }
    }
  }

  return Loader;
});