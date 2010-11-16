
arrayDrawer = function(spec){
  var that = {}

  var subject
  var context 

  var cellWidth
  var arrayHeight = 30
  var pixelsPerChar = 20 
  var fontSize = 20

  var startPosition = {x: 25, y: 25}

  var drawArray = function(array, ctx){
    initialize(spec, array, ctx) 
    
    var arrayWidth = cellWidth * array.length  
    ctx.strokeRect(startPosition.x, startPosition.y, arrayWidth, arrayHeight);
    drawElems()
    drawLinesBetweenElems() 
  }
  that.drawArray = drawArray

  function initialize(spec, array, ctx){
    spec = spec || {}

    subject = toStringArray(array)
    context = ctx 

    cellWidth = spec.cellWidth || maxCellWidth(array)
    arrayHeight = spec.arrayHeight || arrayHeight
    pixelsPerChar = spec.pixelsPerChar || pixelsPerChar
    fontSize = spec.fontSize || fontSize
  }

  function toStringArray(array){
    var out = new Array(array.length)

    for( i = 0 ; i < array.length ; i++){
      out[i] = elementToString( array[i] )
    }
    return out
   }

  function maxCellWidth(){
    if(subject.length === 0)
      return 0

    var max = subject[0].length * pixelsPerChar 
    var current;
    for(i = 0 ; i < subject.length ; i++){
      current = subject[i].length * pixelsPerChar 
      if(current > max){
        max = current
      }
    }
    return max
  }

  function drawElems(){
    context.font = fontSize + "px monospace"
    context.textAlign = "center"

    var currPos = toMiddleOfCell(startPosition)
    for( i = 0 ; i < subject.length ; i++){
      context.fillText( subject[i], currPos.x, currPos.y, cellWidth)
      currPos = toMiddleOfCell( nextPosition(i) ) 
    }
  }

  function drawLinesBetweenElems(){
   var numLines = subject.length - 1
   var drawer = lineDrawer({})

   for(i = 0 ; i < numLines ; i++){
    currPos = nextPosition(i)
    drawer.drawDownStroke(currPos, arrayHeight, context)
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

  function nextPosition(iteration){
    return {x: startPosition.x + cellWidth * (iteration + 1),
            y: startPosition.y}
  }
  
  function toMiddleOfCell(point){
    return {x: point.x + cellWidth / 2,
            y: point.y + (arrayHeight / 2) + fontSize / 2}
  }

  return that
}


lineDrawer = function(spec){
  var that = {}
  
  var drawLine = function(from, to, ctx){
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
  }
  that.drawLine = drawLine

  var drawDownStroke = function(start, strokeHeight, ctx){
    var to = {x:start.x, y:start.y + strokeHeight} 
    drawLine(start, to, ctx)
  }
  that.drawDownStroke = drawDownStroke

  return that
}
