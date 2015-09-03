bloc.prepare('perspective', function () {
  var paper = new SVG(document.body, {
    height: coords.h,
    width: coords.w,
    id: 'trace'
  });
  
  var vanishing_point = paper.createElement('circle', {
    cx: coords.cx,
    cy: Math.floor(coords.h / 4 * 3),
    r: 1
  });
  
  var grid = paper.createElement('g', {'class': 'grid'});
  var note = paper.createElement('g', {'class': 'annotation'});
  
  var a = paper.createElement('line', {
    x1: vanishing_point.get('cx'),
    y1: vanishing_point.get('cy'),
    x2: 0,
    y2: coords.h
  }, grid);

  var b = paper.createElement('line', {
    x1: vanishing_point.get('cx'),
    y1: vanishing_point.get('cy'),
    x2: coords.w,
    y2: coords.h
  }, grid);
  
  console.log(intersection(a, b));
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

  return [numx / denom, numy / denom];
};

