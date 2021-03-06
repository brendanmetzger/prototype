/* A format method to string objects. Will replace all {key}
 * with the corresponding arguments. If key is an integer, then String.format
 * becomes variadic. If the key is text, then the function can use an object
 * provided the first argument is an object
 */
String.prototype.format = function() {
  var args = typeof arguments[0] === 'object' ? arguments[0] : arguments;
  return this.replace(/{((?:\d+)|(?:[a-z0-9]+))}/g, function(match, key) {
    return typeof args[key] != 'undefined' ? args[key] : match;
  });
};

Event.prototype.theta = function () {
  var rect  = this.target.getBoundingClientRect();
  var offset = [(this.offsetX || this.layerX), (this.offsetY || this.layerY)];
  return Math.atan2(offset[0] - (rect.width / 2), (rect.height / 2) - offset[1]);
};

Number.prototype.square = function () {
  return Math.pow(this, 2);
};

SVGElement.prototype.set = function (prop, value) {
  if (prop instanceof Object) {
    for (var key in prop) {
      this.setAttribute(key, prop[key]);
    }
  } else {
    this.setAttribute(prop, value);
  }
};

SVGElement.prototype.get = function (prop) {
  return parseInt(this.getAttribute(prop), 10);
};

Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};

Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};



/* Animation function
 */
var Animate = function (callback) {
  return {
    animations: [],
    tween: function (element, idx) {
      if (callback.call(this.animations[idx], element)) {
        // console.log(this.timer);
        requestAnimationFrame(this.tween.bind(this, element, idx));
      } else {
        if (this.animations[idx].hasOwnProperty('finish')) {
          this.animations[idx].finish(element);
        }
      }
    },
    start: function (element, timer) {
      timer.start = Date.now();
      var idx = this.animations.push(timer) - 1;
      this.tween(element, idx);
      return {
        stop: function () {
          this.animations[idx].duration = 0;
        }.bind(this)
      };
    }
  };
};

window.Adjust = function () {
  var scroller = Animate(function (element) {
    var ratio = Math.min(1, 1 - Math.pow(1 - (Date.now() - this.start) / this.duration, 5)); // float % anim complete 
    var y = ratio >= 1 ? this.to : ( ratio * ( this.to - this.from ) ) + this.from;
    element.scrollTo(0,y);
    return (ratio < 1);
  });
  
  return {
    scroll: function (end, seconds) {
      scroller.start(window, {
        from: window.pageYOffset,
        to: end,
        duration: seconds
      });
    }
  };
}();


var Request = function (callbacks) {
  this.request = new XMLHttpRequest();
  for (var action in callbacks) {
    this.request.addEventListener(action, callbacks[action].bind(this), false);
  }
  return this;
};

Request.prototype = {
  get: function (url) {
    this.request.open('GET', url);
    this.request.send();
  },
  post: function (url, data) {
    this.request.open('POST', url);
    this.request.send(data);
  }
};


/* Quick way to create an SVG element with and a prototypal method
 * to create children elements.
 */ 
var SVG = function (node, options) {
  options['xmlns:xlink'] = 'http://www.w3.org/1999/xlink';
  options.xmlns = 'http://www.w3.org/2000/svg';
  options.version = 1.1;
  this.element = this.createElement('svg', options, node);
};

SVG.prototype.createElement = function(name, opt, parent) {
  var node = document.createElementNS('http://www.w3.org/2000/svg', name);
  for (var key in opt) {
    node.setAttribute(key, opt[key]);
  }
  if (parent === null) {
    return node;
  }
  return (parent || this.element).appendChild(node);
};

SVG.prototype.b64url = function (styles) {
  var wrapper     = document.createElement('div');
  var clone       = wrapper.appendChild(this.element.cloneNode(true));
  var style = this.createElement('style', null, clone);
      style.textContent = styles;
  return 'url(data:image/svg+xml;base64,'+btoa(wrapper.innerHTML)+')';
};

var getCoords = function(evt) {
  var width = window.innerWidth;
  var height = window.innerHeight;
  
  this.coords = {
    w: width,
    h: height,
    cx: window.innerWidth / 2,
    cy: window.innerHeight / 2
  };
};


var Progress = function(container) {  
  var svg, path, handle, message;
  this.element = document.createElement('div');
  this.element.className = 'progress';
  if (container) {
    container.appendChild(this.element);
    this.remove = function () {
      container.removeChild(this.element);
    };
  }
  message = this.element.appendChild(document.createElement('strong'));

  svg = new SVG(this.element, {
    height: 50,
    width: 50,
    viewBox: '0 0 100 100'
  });
  
  svg.createElement('circle', {
    'cx': 50,
    'cy': 50,
    'r': 35
  });
  
  handle = svg.createElement('path', {
    'd': 'M50,50',
    'class': 'handle',
    'transform': 'rotate(-90 50 50)'
  });
  

  path = svg.createElement('path', {
    'd': 'M50,50',
    'transform': 'rotate(-90 50 50)'
  });
  
  
  this.notify = function(percentage, text, mouseover) {
    message.innerHTML = text || message.innerHTML;
    
    var radian = (2 * Math.PI) * percentage;
    var x = (Math.cos(radian) * 35) + 50;
    var y = (Math.sin(radian) * 35) + 50;
    
    var data = "M85,50A35,35 0 " + (y < 50 ? 1 : 0) + "1 " + x + "," + y;
    if (mouseover) {
      handle.setAttribute('d', data);
    } else {
      path.setAttribute('d', data);
    }
  };
  
  

  return this;
};
