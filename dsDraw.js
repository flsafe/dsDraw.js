
function draw(){  
  var canvas = document.getElementById('tutorial');  
  if (canvas.getContext){  
    var ctx = canvas.getContext('2d');  
    var arr = [1000, 2, 3 , 4 ,500]
    drawArray(arr, ctx)
  }  
}  



var ARRAY_HEIGHT = 50
var START_X = 50
var START_Y = 100

function drawArray(array, ctx){
  var arrayWidth = maxCellWidth(array) * array.length  
  
  ctx.strokeRect(START_X, START_Y, arrayWidth, ARRAY_HEIGHT);
  drawCells(array, ctx)
}

function drawCells(array, ctx){
  var cellWidth = maxCellWidth(array)
  drawLines(array.length - 1, START_X, START_Y, cellWidth, ARRAY_HEIGHT, ctx) 
  for( i = 1 ; i <= array.length ; i++){
    currX = START_X + cellWidth * i
    currY = START_Y
    ctx.font = "20px monospace"
    ctx.fillText( array[i-1], currX, currY, cellWidth )
  }
}

function drawLines(number, startX, startY, space, height, ctx){
 for(i = 1 ; i <= number ; i++){
  currX = startX + space * i 
  currY = startY 
  ctx.beginPath()
  ctx.moveTo(currX, currY)
  ctx.lineTo(currX, currY + height)
  ctx.stroke()
 }
}

var PIXELS_PER_DIGIT = 25

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
