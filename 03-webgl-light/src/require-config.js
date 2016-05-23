requirejs.config({
    baseUrl: 'src/webgl',
    paths: {
      debugPanel : "../debug/debug-panel",
      vendor: '../vendor',
      stats:'../vendor/stats',
      text : "../vendor/require-text",
      lodash: '../vendor/lodash',
      domReady : "../vendor/require-domReady"
    },
    
    map: {
      "*": {
        underscore: 'lodash'  
      }
    },

    shim: {
      tweening: {
          exports: "TweenMax"
      },
      
      'vendor/jquery.mousewheel': ['jquery'],

      stats: {
        exports: 'Stats'
      },
      'vendor/webgl-obj-loader': {
        exports: 'OBJ'
      }
    }
});