

var Player = function (playlist) {
  this.list = playlist;
  
  this.audio = new Audio();
  this.audio.preload = 'metadata';
  
  ['ended', 'timeupdate', 'playing'].forEach(function (trigger) {
    this.audio.addEventListener(trigger, this[trigger].bind(this), false);
  }.bind(this));
  
  this.fader =  Animate(function (element) {
    var ratio = Math.min(1, 1 - Math.pow(1 - (Date.now() - this.start) / this.duration, 5)); // float % anim complete 
    element.volume = ratio >= 1 ? this.to : ( ratio * ( this.to - this.from ) ) + this.from;
    return (ratio < 1);
  });
  
  this.request = new Request({
    load: function (evt) {
      console.log(evt.target.responseText);
    }
  });
  
};

Player.prototype = {
  index: null,
  allow: true,
  rate: 1,
  play: function (track) {
    if (typeof track === 'number' && this.index != track) {
      this.index = track;
      this.audio.src = this.list[this.index];
    }
    this.audio.play();
  },
  pause: function () {
    this.audio.pause();
  },
  seek: function (float) {
    this.audio.currentTime = this.audio.duration * float;
  },
  toggle: function () {
    if (this.audio.paused) {
      this.play(this.index || 0);
    } else {
      this.pause();
    }
  },
  ended: function (evt) {
    console.log('send the data!');
    this.request.post('graph/update', {'item1': ['one', 'two', 'three']});
    this.index++;
  },
  timeupdate: function (evt) {
    var complete = Math.round((this.audio.currentTime / this.audio.duration) * 1000) / 1000;
    if (this.allow && ((complete % 0.25) === 0)) {
      this.trigger(complete/0.25);
    }
  },
  playing: function (evt) {
   // ... 
  },
  trigger: function (index) {
    this.allow = false;
    this.fade(0, function () {
      window.backdrop.show();
      this.audio.pause(); 
    }.bind(this));
  },
  fade: function (to, callback) {
    if (to === 1 && this.audio.paused) {
      this.audio.play();
      this.allow = true;
    }
    this.fader.start(this.audio, {
      duration: 1500,
      from: this.audio.volume,
      to: to,
      finish: callback || function () {}
    });
  },
  notify: function (evt, subject) {
    window.backdrop.hide();
    var p = subject.getPolar(evt);
    this.fade(1);
    var benchmark =  p.theta.toPrecision(4) + ',' + (p.radius / (subject.coords.cy)).toPrecision(2);
    console.log(benchmark);
  }
};





var Dataset = function () {
  
};