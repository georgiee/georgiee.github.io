define(["vendor/dat.gui"], function(gui) {
  var gui = new dat.GUI();

  var params = {
    note: 'Hadcrafted WebGL Renderer with Light',
    
    light: {
      active: true,
      x: 0,
      y: 1,
      z: 0,
      ambientColor: [ 55, 55, 55],
      lightColor: [ 255, 255, 255],
    }
    
  }

  var folder;

  gui.add(params, 'note').name('Note:');
  
  folder = gui.addFolder('Lightning');
  folder.closed = false;

  folder.add(params.light, 'active').name('Use Lightning');
  folder.add(params.light, 'x',-1, 1).step(0.01);
  folder.add(params.light, 'y',-1, 1).step(0.01);
  folder.add(params.light, 'z',-1, 1).step(0.01);
  folder.addColor(params.light, 'ambientColor').name('Ambient Color');;
  folder.addColor(params.light, 'lightColor').name('Light Color');
  
  return {
    gui: gui,
    params: params,
    
    registerModel: function(model, name, opened){
      var params = {
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        rotation: 0
      }

      folder = gui.addFolder(name);
      folder.closed = !(opened === true);

      folder.add(params, 'x').listen();
      folder.add(params, 'y').listen();
      folder.add(params, 'z').listen();
      folder.add(params, 'rotationX').listen();
      folder.add(params, 'rotationY').listen();
      folder.add(params, 'rotationZ').listen();
      return {params: params, folder: folder};
    }
  };
});