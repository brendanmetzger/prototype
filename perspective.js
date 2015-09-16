var paper;
bloc.prepare('perspective', function () {
  paper = new SVG(document.body, {
    height: coords.h,
    width: coords.w,
    id: 'trace'
  });
  
  
  var grid = paper.createElement('g', {'class': 'grid'});
  grid = drawPerspective(grid, Math.floor(coords.h / 4 * 2.5));
});





var intersection = function (lineA, lineB) {
  var x1 = lineA.get('x1');
  var y1 = lineA.get('y1');
  var x2 = lineA.get('x2');
  var y2 = lineA.get('y2');
  
  var x3 = lineB.get('x1');
  var y3 = lineB.get('y1');
  var x4 = lineB.get('x2');
  var y4 = lineB.get('y2');
  
  var numx = ( ( (x1*y2) - (y1*x2) ) * ( x3 - x4 ) ) - ( ( x1 - x2 ) * ( (x3*y4) - (y3*x4) ) );
  var numy = ( ( (x1*y2) - (y1*x2) ) * ( y3 - y4 ) ) - ( ( y1 - y2 ) * ( (x3*y4) - (y3*x4) ) );
  var denom = ((x1 - x2) * (y3 - y4)) - ((y1 - y2) * (x3 - x4));
  if (denom === 0) return 0;
  return [numx / denom, numy / denom];
};

function drawPerspective(grid, horizon) {
  
  var guide = paper.createElement('line', {
    style: 'stroke:none',
    x1:0,
    y1: horizon,
    x2: coords.w,
    y2: coords.h
  });

  var density = 10;
  var vlines = [];
  var hlines = [];
  var space = coords.w / density;
  
  
  for (var i = (-4 * density); i <= (density * 8); i++) {
    vlines[i] = paper.createElement('line', {
      x1: coords.cx,
      y1: horizon,
      x2: space * i,
      y2: coords.h
    }, grid);
    
    var intersect = intersection(guide, vlines[i]);
    if (intersect[1] > horizon) {
      
      hlines.push(paper.createElement('line', {
        x1: 0,
        y1: intersect[1],
        x2: coords.w,
        y2: intersect[1]
      }, grid));
    }
    
    var trim = intersection(hlines[0], vlines[i]);
    
    vlines[i].set({
      x1: trim[0],
      y1: trim[1]
    });
    
  }
  
  return grid;
}

function movePerspective(input) {
  var grid = paper.createElement('g', {'class': 'grid'});
  paper.element.replaceChild(grid, paper.element.querySelector('g.grid'));
  
  grid = drawPerspective(grid, Math.floor((coords.h * (input.value / 100)) / 4 * 2.5));
}