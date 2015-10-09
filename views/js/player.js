

var Player = function (playlist, form) {
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
};


Player.prototype = {
  index: null,
  allow: true,
  rate: 1,
  form: null,
  formindex: null,
  observer: {
    timeupdate: null,
    form: null
  },
  register: function (method, observer) {
    this.observer[method] = observer;
  },
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
    this.index++;
  },
  timeupdate: function (evt) {
    if (this.allow) {
      var complete = Math.round((this.audio.currentTime / this.audio.duration) * 1000) / 1000;
      if ((complete % 0.25) === 0) {
        this.allow = false;
        this.trigger(complete/0.25);
      }
      this.observer.timeupdate.notify(complete, (complete * 100).toFixed(1) + '%');
    }
  },
  playing: function (evt) {
   // ... 
  },
  trigger: function (index) {
    this.formindex = index;
    window.backdrop.show();
    this.fade(0, function () {
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
    var p = subject.getPolar(evt);
    this.observer.form.call(this, this.formindex, p.theta.toPrecision(4), (p.radius / (subject.coords.cy)).toPrecision(2));
    this.fade(1);
    window.backdrop.hide();
  }
};

