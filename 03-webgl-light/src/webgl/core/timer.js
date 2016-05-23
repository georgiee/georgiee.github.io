define([], function(){
  var Timer = function(updateCallback, updateContext){
    this.updateCallback = updateCallback;
    this.updateContext = updateContext;

    this.time = null;
    this.lastTime = null;
    this.elapsedTime = null;
    this.frameCount = null;
    this.rafID = null;

    var vendors = [
      'ms',
      'moz',
      'webkit',
      'o'
    ];

    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x++){
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'];
    }
    this.updateRAF = this.updateRAF.bind(this);
  }

  Timer.prototype = {
    start: function(){
      this.elapsedTime = 0;
      this.rafID = window.requestAnimationFrame(this.updateRAF);
    },
    
    stop: function(){
      if(this.rafID){
        window.cancelAnimationFrame(this.rafID);
      }

      this.updateCallback = null;
      this.updateContext = null;
    },

    updateRAF: function(){
      this.updateTimer();
      this.rafID = window.requestAnimationFrame(this.updateRAF);

      this.updateCallback.call(this.updateContext);
    },
    
    updateTimer: function(){
      // twice as fast as (new Date).getTime(), http://jsperf.com/date-now-vs-new-date
      this.frameCount++;
      this.time = Date.now();
      this.elapsedTime = this.time - this.lastTime;
      this.lastTime = this.time;
    }
  }

  return  Timer;
});