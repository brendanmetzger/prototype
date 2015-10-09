
var Graph = function (container, domain) {
  this.coords = container.getBoundingClientRect();
  this.coords.cx = this.coords.width / 2;
  this.coords.cy = this.coords.height / 2;
  
  this.domain = domain;
  this.legend = new Uint8Array(360);
  this.clock  = new SVG(container, {
    height: this.coords.height,
    width: this.coords.width,
    id: 'trace'
  });
  
  this.amplitude = this.clock.createElement('path', {});
  this.drawSegments(this.clock.createElement('g', {'class': 'grid'}));
  
  var boundary  = this.clock.createElement('circle', {
    cx: this.coords.cx,
    cy: this.coords.cy,
    r: this.coords.cy,
    style: 'stroke-opacity:0.075;'
  });
  
  
  boundary.addEventListener('mousemove', this.watch.bind(this), false);
  boundary.addEventListener('click', this.record.bind(this), false);
};

Graph.prototype = {
  observers: [],
  register: function (object) {
    this.observers.push(object);
  },
  drawSegments: function (container) {
    var total  = this.domain.length;
    var arclen = (Math.PI / total);
    
    for (var i = 0; i < total; i++) {
      var rad_pos = ((2 * Math.PI) / total) * i;
      var start  = (rad_pos - arclen) * (180 / Math.PI);
      var finish = (rad_pos + arclen) * (180 / Math.PI);
    
      while (start < finish) {
        this.legend[Math.floor(start > 0 ? start : start + 360)] = i;
        start+=1;
      }
    
      this.domain[i].segment = this.clock.createElement('path', {
        id: this.domain[i].color,
        style: "fill:" + this.domain[i].color,
        d: "M{mx},{my}L{x1},{y1}A{r},{r},0 0 0 {x2}, {y2}z".format({
          r: this.coords.cy / total * 4,
          mx: this.coords.cx,
          my: this.coords.cy,
          x1: Math.cos(rad_pos - arclen) * this.coords.cy + this.coords.cx,
          y1: Math.sin(rad_pos - arclen) * this.coords.cy + this.coords.cy,
          x2: Math.cos(rad_pos + arclen) * this.coords.cy + this.coords.cx,
          y2: Math.sin(rad_pos + arclen) * this.coords.cy + this.coords.cy,
        })
      }, container);
    
      this.clock.createElement('text', {
        x: Math.cos(rad_pos) * (this.coords.cy * 0.85) + this.coords.cx,
        y: Math.sin(rad_pos) * (this.coords.cy * 0.85) + this.coords.cy,
        dy: 5
      }, container).textContent = this.domain[i].title;
    }
  },
  getPolar: function (evt) {
    var t = evt.theta() - (Math.PI / 2);
    return {
      radius: Math.sqrt((evt.layerX - this.coords.cx).square() + (this.coords.cy - evt.layerY).square()),
      theta: t < -Math.PI ? t + (Math.PI * 2) : t
    };
  },
  watch: function (evt) {
    var p = this.getPolar(evt);
    
    var deg = p.theta * (180 / Math.PI);
        deg = Math.floor(deg > 0 ? deg : deg + 360);
    var segment = this.domain[this.legend[deg]];
        
    var arclen = (Math.PI / this.domain.length) * (p.radius / this.coords.cy);
    var wedge = {
        r: p.radius,
        mx: this.coords.cx,
        my: this.coords.cy,
        x1: Math.cos(p.theta - arclen) * p.radius + this.coords.cx,
        y1: Math.sin(p.theta - arclen) * p.radius + this.coords.cy,
        x2: Math.cos(p.theta + arclen) * p.radius + this.coords.cx,
        y2: Math.sin(p.theta + arclen) * p.radius + this.coords.cy,
      };

    this.amplitude.set({
      d: "M{mx},{my}L{x1},{y1}A{r},{r},1 0 1 {x2}, {y2}z".format(wedge),
      style: 'stroke:none;fill-opacity:0.75;fill:' + segment.color
    });
  },
  record: function (evt) {
    this.amplitude.set('d', "M0,0L0,0A0,0,1 0 1 0, 0z");
    this.observers.forEach(function (observer) {
      observer.notify(evt, this);
    }, this);
  }
};
