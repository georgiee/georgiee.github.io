requirejs(['require-config'], function() {
  requirejs(['domReady!', 'scene-01', 'debugPanel'],

  function (document, Scene01) {
    var scene = new Scene01();
    scene.run();
  });
})