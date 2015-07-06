"use strict"
var poly = require("polygon")

// Clips a convex polygon by a line (TODO: document expected orientation of line)
function clipPolygon(polygon, line) {
  var nx = line[0][1] - line[1][1]
    , ny = line[1][0] - line[0][0]
    , l = nx*line[0][0] + ny*line[0][1]
  // Find farthest point in direction of normal
  /*var begin = 0, end = polygon.length, mid = Math.round(end/3), pt
  var fb = nx*polygon[begin][0] + ny*polygon[begin][1]
    , fm = nx*polygon[mid][0] + ny*polygon[mid][1]
    , fe = nx*polygon[end][0] + ny*polygon[end][1], fp
  if (fb>=fm && fe>=fm) { // "Farthest" point may not be in-between start and end point in the classical sense, invert normal.
    nx = -nx
    ny = -ny
  }
  // TODO: Check that we always progress
  while(begin+1<end) { // Maintain invariant that fb,fe<=fm
	pt = begin + (end - mid)
	fp = nx*polygon[pt][0] + ny*polygon[pt][1]
	if (fp > fm) {
	  fm = fp
	  if (mid < pt) 
    }
  }*/
  var prevCoef = nx*polygon[polygon.length-1][0]+ny*polygon[polygon.length-1][1], coef
  var inPolygon = prevCoef<l, result = [], t
  for(var i=0; i<polygon.length; i++) {
    coef = nx*polygon[i][0]+ny*polygon[i][1]
    if (coef<l) { // In
      if (!inPolygon) {
        t = (l-prevCoef)/(coef-prevCoef)
        result.push([polygon[(i+polygon.length-1)%polygon.length][0]+t*(polygon[i][0]-polygon[(i+polygon.length-1)%polygon.length][0]),polygon[(i+polygon.length-1)%polygon.length][1]+t*(polygon[i][1]-polygon[(i+polygon.length-1)%polygon.length][1])])
      }
      result.push(polygon[i])
      inPolygon = true
    } else { // Out
      if (inPolygon) {
        t = (l-prevCoef)/(coef-prevCoef)
        result.push([polygon[(i+polygon.length-1)%polygon.length][0]+t*(polygon[i][0]-polygon[(i+polygon.length-1)%polygon.length][0]),polygon[(i+polygon.length-1)%polygon.length][1]+t*(polygon[i][1]-polygon[(i+polygon.length-1)%polygon.length][1])])
      }
      inPolygon = false
    }
    prevCoef = coef
  }
  return result
}

module.exports = function(polygon, line) { return Math.abs(poly(clipPolygon(polygon, line)).area()) }
