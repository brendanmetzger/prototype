

var Player = function (playlist) {
  this.list = playlist;
  
  this.audio = new Audio();
  this.audio.preload = 'metadata';
  
  
  ['ended', 'timeupdate', 'playing'].forEach(function (trigger) {
    this.audio.addEventListener(trigger, this[trigger].bind(this), false);
  }.bind(this));
  
  this.fader =  Animate(function (element) {
    var ratio = Math.min(1, 1 - Math.pow(1 - (Date.now() - this.start) / this.duration, 5)); // float % anim complete 
    var A = ratio >= 1 ? this.to : ( ratio * ( this.to - this.from ) ) + this.from;
    element.volume = A;
    return (ratio < 1);
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
    //...
  },
  timeupdate: function (evt) {
    var complete = Math.round((this.audio.currentTime / this.audio.duration) * 1000) / 1000;
    if (this.allow && ((complete % 0.25) === 0)) {
      this.trigger();
    } else {
      console.log(complete);
    }
  },
  playing: function (evt) {
   // ... 
  },
  trigger: function () {
    this.allow = false;
    this.fade(0, function () {
      showSpecialScreen();
      this.audio.pause(); 
    }.bind(this));
    
  },
  fade: function (to, callback) {
    if (to === 1 && this.audio.paused) {
      this.audio.play();
    }
    this.fader.start(this.audio, {
      duration: 1500,
      from: this.audio.volume,
      to: to,
      finish: callback || function () {}
    });
  }
};

var div = document.body.appendChild(document.createElement('div'));
div.style.height    = '80vh';
div.style.width     = '80vw';
div.style.margin    = '10vh 10vw';
div.style.border    = '1px solid #333';
div.style.padding   = '5em';
div.style.boxSizing = 'border-box';
div.style.position  = 'absolute';
div.style.display   = 'none';
div.textContent     = "click anywhere to resume";

div.style.backgroundColor = 'rgba(255,255,255,0.85)';

div.addEventListener('click', function (evt) {
  div.style.display = 'none';
  player.fade(1);
  player.allow = true;
}, false);


function showSpecialScreen() {
  div.style.display = "block";
  
}