
bloc.prepare('viewer', function () {  
  var clock = new SVG(document.body, {
    height: coords.h,
    width: coords.w,
    id: 'trace'
  });
  
  var grid = clock.createElement('g', {'class': 'grid'});
  var note = clock.createElement('g', {'class': 'annotation'});
  
  clock.createElement('line', {
    x1: 0,
    y1: coords.cy,
    x2: coords.w,
    y2: coords.cy
  }, grid);
  clock.createElement('line', {
    x1: coords.cx,
    y1: 0,
    x2: coords.cx,
    y2: coords.h
  }, grid);
  
  var line = clock.createElement('line', {
    x1: coords.cx,
    y1: coords.cy,
    x2: coords.cx,
    y2: coords.cy,
  });
  
  var boundary = clock.createElement('circle', {
    cx: coords.cx,
    cy: coords.cy,
    r: coords.cy
  });
  
  var angle_ref = clock.createElement('text', {
    x: coords.cx,
    y: coords.cy,
    dy: 5,
    dx: -10
  }, note);
  
  var radius_ref = clock.createElement('text', {
    x: coords.cx + 100,
    y: coords.cy + 100,
    dy: -10,
    dx: -10
  }, note);
  
  var amplitude = clock.createElement('circle', {
    cx: coords.cx,
    cy: coords.cy,
    r: 1
  }, grid);
  
  document.body.style.height = window.innerHeight + 'px';
  
  boundary.addEventListener('mousemove', function (evt) {
    var theta  = Math.round(evt.theta());
    var radius = Math.round(Math.sqrt((evt.layerX - coords.cx).square() + (coords.cy - evt.layerY).square()));
    
    angle_ref.textContent = theta + 'º';
    radius_ref.textContent = radius;
    
    line.set({
      x2: evt.layerX,
      y2: evt.layerY
    });
    
    
    amplitude.set('r', radius);
    
    angle_ref.set({
      x: Math.cos(Math.radians(theta -45)) * 50 + coords.cx,
      y: Math.sin(Math.radians(theta -45)) * 50 + coords.cy
    });
    
    radius_ref.set({
      x: evt.layerX,
      y: evt.layerY
    });
    

  }, false);
});


