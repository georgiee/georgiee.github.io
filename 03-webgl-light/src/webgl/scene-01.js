define(['core/timer','stage'], function(Timer, Stage){
  var Scene01 = function(){
    this.run = function(){
      var canvas = document.getElementById('stage');
      this.stage = new Stage(canvas, 500, 500);
    }  
  }

  
  return Scene01;
})