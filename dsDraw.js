var ARRAY_HEIGHT = 30
var CELL_WIDTH
var startPosition = {x: 25, y: 50}
var FONT = 20
var PIXELS_PER_CHAR = 20
var DELETE_VERT_MARGINE = 75


/**
 * Draw a diagram that represents
 * deleting an element in an array by shifting left.
 * @param {Array} array The array to delete from
 * @param {Integer} index The index that will be deleted
 * @param {Context} ctx The canvas context
 */
function drawDelete(array, index, ctx){
  if(array.length === 0 || index < 0 || index >= array.length)
    return

  var array = toStringArray(array)
  var deletedArray = deleteIndex(index, array)

  drawStackedArrays(array, deletedArray, ctx)
  if( index == array.length - 1 ){
    drawInsertArrow(index, ctx)
  }
  else{
    drawShiftArrows(index, array.length, ctx)
    drawInsertArrow(array.length - 1, ctx)
  }
}

function drawStackedArrays(arr1, arr2, ctx){
  var width = Math.max( maxCellWidth(arr1), maxCellWidth(arr2) )
  var sameWidth = {cellWidth: width}
  ctx.save()
    drawArray(arr1, ctx, sameWidth)
    ctx.translate(0, DELETE_VERT_MARGINE)
    drawArray(arr2, ctx, sameWidth)
  ctx.restore()
}

function drawShiftArrows(startIndex, arrayLength, ctx){
 for(i = startIndex ; i < arrayLength - 1 ; i++){
   drawShiftArrow(i, ctx)
 }
}

function drawInsertArrow(index, ctx){
  var arrowStart = calcInsertArrowStart(index)
  var arrowEnd = calcInsertArrowEnd(index)
  drawArrow(arrowStart, arrowEnd, ctx)
}

function calcInsertArrowStart(index){
  var start =  toBottonMiddle( currentPosition(index) )
  start.y += (DELETE_VERT_MARGINE - ARRAY_HEIGHT) / 2 
  return start 
}

function calcInsertArrowEnd(index){
  var end = toBottonMiddle( currentPosition(index) )
  end.y += (DELETE_VERT_MARGINE - ARRAY_HEIGHT)
  return end
}

function drawShiftArrow(i, ctx){
  var arrowStart = toBottonMiddle( nextPosition(i) )
  var arrowEnd = calcShiftArrowEnd(arrowStart)
  drawArrow(arrowStart, arrowEnd, ctx)
}

function toBottonMiddle(pos){
  return {x: pos.x + (CELL_WIDTH / 2),
          y: pos.y + ARRAY_HEIGHT}
}

function calcShiftArrowEnd(pos){
  return {x: pos.x - CELL_WIDTH,
          y: pos.y + (DELETE_VERT_MARGINE - ARRAY_HEIGHT)}
}

/**
 * Draw an arrow starting from tail and
 * the arrow head pointing to point
 * @param {Point} tail 2D vector with x and y properties
 * @param {Point} point 2D vector with x and y properties
 */
function drawArrow(tail, point, ctx){
  drawArrowBody(tail, point, ctx)
  drawHead(tail, point, ctx)
}

function drawArrowBody(tail, point, ctx){
  ctx.beginPath()
    ctx.moveTo(tail.x, tail.y)
    ctx.lineTo(point.x, point.y)
  ctx.stroke()
}

function drawHead(tail, point, ctx){
  var basePoints = calcArrowHeadBasePoints(tail, point)

  ctx.beginPath()
    ctx.moveTo(basePoints.p1.x, basePoints.p1.y)
    ctx.lineTo(point.x, point.y)
  ctx.stroke()

  ctx.beginPath()
    ctx.moveTo(basePoints.p2.x, basePoints.p2.y)
    ctx.lineTo(point.x, point.y)
  ctx.stroke()
}

function calcArrowHeadBasePoints(tail, point){
  var toTail = vectNormalize( vectDiff(tail, point) )
  var perpToArrowBody = vectNegRecipricol(toTail)
  var arrowBaseMid = vectAdd(point, vectMult(toTail, 20))
  
  var basePoint1 = vectAdd(arrowBaseMid, vectMult(perpToArrowBody, 5))
  var basePoint2 = vectAdd(arrowBaseMid, vectMult( vectMult(perpToArrowBody, 5), -1))
  return {p1: basePoint1, p2: basePoint2} 
}

function vectMult(v, m){
  return {x: v.x * m,
          y: v.y * m}
}

function vectNegRecipricol(v){
  return {x: -1 * v.y,
          y: 1 * v.x}
}

function vectAdd(v1, v2){
  return {x: v1.x + v2.x,
          y: v1.y + v2.y}
}

function vectDiff(v1, v2){
  return {x: v1.x - v2.x,
          y: v1.y - v2.y}
}

function vectNormalize(v){
 var magnitude = Math.sqrt( Math.pow(v.x, 2) + Math.pow(v.y, 2) ) 
 return {x: v.x/magnitude,
         y: v.y/magnitude}
}

/**
 * Draw an array
 * @param {Array} array The array to draw
 * @param {Context} ctx Canvas context
 * @param {Object} ops Drawing options {cellWidth}
 */
function drawArray(array, ctx, ops){
  var array = toStringArray(array)

  CELL_WIDTH = getOp('cellWidth', ops) || maxCellWidth(array)
  var arrayWidth = CELL_WIDTH * array.length  
  
  ctx.strokeRect(startPosition.x, startPosition.y, arrayWidth, ARRAY_HEIGHT);
  drawElems(array, ctx)
  drawLinesBetweenElems(array, ctx) 
}

function getOp(name, ops){
  if( typeof ops === 'undefined' ){
    return false
  }
  return ops[name]
}

function deleteIndex(index, array, ops){
  var out = new Array(0)
  for(i = 0 ; i <= array.length ; i++){
    if( i !== index ){
      out.push( array[i] )
    }
  }
  return out.map(function (e){
    if( typeof e === 'undefined'){
      return getOp('undefined', ops) || '\\0'
    }
    return e
  })
}

function toStringArray(array){
  var out = new Array(array.length)

  for( i = 0 ; i < array.length ; i++){
    out[i] = elementToString( array[i] )
  }
  return out
 }

function elementToString(element){
  if( typeof element === 'number' ){
    return element + ""
  }
  else if ( element === null ){
    return "null" 
  }
  else if( typeof element === 'object' || typeof element === 'boolean'){
    return element.toString()
  }
  else if( typeof element == 'string' ){
    return element
  }
  else {
    return typeof element 
  }
}

function drawElems(array, ctx){
  ctx.font = FONT + "px monospace"
  ctx.textAlign = "center"

  var currPos = toMiddleOfCell(startPosition)
  for( i = 0 ; i < array.length ; i++){
    ctx.fillText( array[i], currPos.x, currPos.y, CELL_WIDTH )
    currPos = toMiddleOfCell( nextPosition(i) ) 
  }
}

function currentPosition(iteration){
  return {x: startPosition.x + CELL_WIDTH * (iteration),
          y: startPosition.y}
}

function nextPosition(iteration){
  return {x: startPosition.x + CELL_WIDTH * (iteration + 1),
          y: startPosition.y}
}

function toMiddleOfCell(point){
  return {x: point.x + CELL_WIDTH / 2,
          y: point.y + (ARRAY_HEIGHT / 2) + FONT / 2}
}

function drawLinesBetweenElems(array ,ctx){
 var numLines = array.length - 1
 for(i = 0 ; i < numLines ; i++){
  currPos = nextPosition(i)
  drawLine(currPos, ARRAY_HEIGHT, ctx)
 }
}

function drawLine(from, height, ctx){
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(from.x, from.y + height)
  ctx.stroke()
}

function maxCellWidth(array){
  if(array.length === 0)
    return 0

  var max = array[0].length * PIXELS_PER_CHAR
  var current;
  for(i = 0 ; i < array.length ; i++){
    current = array[i].length * PIXELS_PER_CHAR
    if(current > max){
      max = current
    }
  }
  return max
}
