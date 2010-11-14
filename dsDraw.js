var ARRAY_HEIGHT = 30
var CELL_WIDTH
var startPosition = {x: 25, y: 50}
var FONT = 20
var PIXELS_PER_CHAR = 20

function draw(){  
  var canvas = document.getElementById('tutorial');  
  if (canvas.getContext){  
    var ctx = canvas.getContext('2d');  

    var arr = [1,  "empty", null, 10, 20000, "\\0"]
    drawArray(arr, ctx)
  }  
}  

function drawArray(array, ctx){
  var array = toStringArray(array)

  CELL_WIDTH = maxCellWidth(array)
  var arrayWidth = CELL_WIDTH * array.length  
  
  ctx.strokeRect(startPosition.x, startPosition.y, arrayWidth, ARRAY_HEIGHT);
  drawElems(array, ctx)
  drawLinesBetweenElems(array, ctx) 
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
