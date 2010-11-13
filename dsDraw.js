
function draw(){  
  var canvas = document.getElementById('tutorial');  
  if (canvas.getContext){  
    var ctx = canvas.getContext('2d');  
    var arr = [12, 15, 45, 1, 2, 5]
    drawArray(arr, ctx)
  }  
}  

var ARRAY_HEIGHT = 30
var START_X = 25
var START_Y = 50
var FONT = 20
var PIXELS_PER_DIGIT = 20

function drawArray(array, ctx){
  var arrayWidth = maxCellWidth(array) * array.length  
  
  ctx.strokeRect(START_X, START_Y, arrayWidth, ARRAY_HEIGHT);
  drawElems(array, ctx)
  drawLinesBetweenElems(array, ctx) 
}

function drawElems(array, ctx){
  cellWidth = maxCellWidth(array)
  currX = START_X
  currY = START_Y
  currX += cellWidth / 2
  currY += (ARRAY_HEIGHT / 2) + FONT / 2

  for( i = 1 ; i <= array.length ; i++){
    ctx.font = FONT + "px monospace"
    ctx.textAlign = "center"
    ctx.fillText( array[i-1], currX, currY, cellWidth )
    currX = START_X + cellWidth * i
    currY = START_Y

    currX += cellWidth / 2
    currY += (ARRAY_HEIGHT / 2) + FONT / 2
  }
}

function drawLinesBetweenElems(array ,ctx){
 spaceBetween = maxCellWidth(array)
 numLines = array.length - 1
 for(i = 1 ; i <= numLines ; i++){
  currX = START_X + spaceBetween * i 
  ctx.beginPath()
  ctx.moveTo(currX, START_Y)
  ctx.lineTo(currX, START_Y + ARRAY_HEIGHT)
  ctx.stroke()
 }
}

function maxCellWidth(array){
  var max = numDigits(array[0]) * PIXELS_PER_DIGIT
  var current;
  for( elm in array){
    current = numDigits(elm) * PIXELS_PER_DIGIT
    if(current > max){
      max = current
    }
  }
  return max
}

function numDigits(num){
  var digits = 0;
  while(num > 0){
    num = Math.floor(num / 10)
    digits += 1
  }
  return digits
}
