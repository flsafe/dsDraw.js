
function draw(){  
  var canvas = document.getElementById('tutorial');  
  if (canvas.getContext){  
    var ctx = canvas.getContext('2d');  
    var arr = [1,  "empty", null, 10, 20000]
    drawArray(arr, ctx)
  }  
}  

var ARRAY_HEIGHT = 30
var ARRAY_WIDTH;
var CELL_WIDTH;

var START_X = 25
var START_Y = 50
var FONT = 20
var PIXELS_PER_CHAR = 20


function drawArray(array, ctx){
  toStringArray(array)

  CELL_WIDTH = maxCellWidth(array)
  arrayWidth = CELL_WIDTH * array.length  
  
  ctx.strokeRect(START_X, START_Y, arrayWidth, ARRAY_HEIGHT);
  drawElems(array, ctx)
  drawLinesBetweenElems(array, ctx) 
}

function toStringArray(array){
  for( i = 0 ; i < array.length ; i++){
    array[i] = elementToString( array[i] )
  }
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
  var currX = START_X
  var currY = START_Y
  currX += CELL_WIDTH / 2
  currY += (ARRAY_HEIGHT / 2) + FONT / 2

  for( i = 1 ; i <= array.length ; i++){
    ctx.font = FONT + "px monospace"
    ctx.textAlign = "center"
    ctx.fillText( array[i-1], currX, currY, CELL_WIDTH )
    currX = START_X + CELL_WIDTH * i
    currY = START_Y

    currX += CELL_WIDTH / 2
    currY += (ARRAY_HEIGHT / 2) + FONT / 2
  }
}

function drawLinesBetweenElems(array ,ctx){
 var spaceBetween = CELL_WIDTH
 var numLines = array.length - 1
 for(i = 1 ; i <= numLines ; i++){
  currX = START_X + spaceBetween * i 
  ctx.beginPath()
  ctx.moveTo(currX, START_Y)
  ctx.lineTo(currX, START_Y + ARRAY_HEIGHT)
  ctx.stroke()
 }
}

function maxCellWidth(array){
  var max = array[0].length * PIXELS_PER_CHAR
  var current;
  for( i in array){
    current = array[i].length * PIXELS_PER_CHAR
    if(current > max){
      max = current
    }
  }
  return max
}
