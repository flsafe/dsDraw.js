var dsDraw = {
  startPosition: {x: 25, y: 25}
}

var arrayDrawer = function(spec){
  spec = spec || {}
  var that = {}
  var startPosition = dsDraw.startPosition

  var subject
  var context 
  var cellWidth
  var arrayHeight = 30
  var pixelsPerChar = 20 
  var fontSize = 20


  var draw = function(array, ctx){
    initialize(array, ctx) 
    
    ctx.save()
      var arrayWidth = cellWidth * array.length  
      ctx.strokeRect(startPosition.x, startPosition.y, arrayWidth, arrayHeight);
      drawElems()
      drawLinesBetweenElems() 
    ctx.restore()
  }
  that.draw = draw 

  function initialize(array, ctx){
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


var lineDrawer = function(spec){
  var that = {}
  
  var draw = function(from, to, ctx){
    ctx.save()
      ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
      ctx.stroke()
    ctx.restore()
  }
  that.draw = draw 

  var drawDownStroke = function(start, strokeHeight, ctx){
    var to = {x:start.x, y:start.y + strokeHeight} 
    draw(start, to, ctx)
  }
  that.drawDownStroke = drawDownStroke

  return that
}


var arrowDrawer = function(spec){
  spec = spec || {}
  var that = {}

  var context
  var arrow = {}
  var arrowHeadLength = 20
  var arrowHeadBase = 5

  var draw = function(tail, point, ctx){
    initialize(tail, point, ctx)
  
    ctx.save()
      drawArrowBody()
      drawHead()
    ctx.restore()
  } 
  that.draw = draw 

  var drawStiple = function(space, count, ctx){
    ctx.save()
     return 0
   ctx.restore()
  }
  that.drawStiple = drawStiple

  function initialize(tail, point, ctx){
    arrow.head = {}
    arrow.tail = {}

    context = ctx
    arrow.head.x = point.x
    arrow.head.y = point.y
    arrow.tail.x = tail.x
    arrow.tail.y = tail.y

    arrowHeadLength = spec.arrowHeadLength || arrowHeadLength
    arrowHeadBase = spec.arrowHeadBase || arrowHeadBase
  }

  function drawArrowBody(){
    var line = lineDrawer({})
    line.draw(arrow.tail, arrow.head, context)
  }

  function drawHead(){
    var line = lineDrawer()
    var basePoints = calcArrowHeadBasePoints()

    line.draw(basePoints.p1, arrow.head, context)
    line.draw(basePoints.p2, arrow.head, context)
  }

  function calcArrowHeadBasePoints(){
    var toTail = Vect.normalize( Vect.diff(arrow.tail, arrow.head) )
    var perpToArrowBody = Vect.negRecipricol(toTail)
    var arrowBaseMid = Vect.add(arrow.head, Vect.mult(toTail, 20))
    
    var basePoint1 = Vect.add(arrowBaseMid, Vect.mult(perpToArrowBody, 5))
    var basePoint2 = Vect.add(arrowBaseMid, Vect.mult( Vect.mult(perpToArrowBody, 5), -1))
    return {p1: basePoint1, p2: basePoint2} 
  }

 return that 
}


var Vect = {
  mult: function(v, m){
          return {x: v.x * m,
                  y: v.y * m}
         },

  negRecipricol: function(v){
                  return {x: -1 * v.y,
                          y: 1 * v.x}
                 },
  
  add: function(v1, v2){
        return {x: v1.x + v2.x,
                y: v1.y + v2.y}
       },

  diff: function(v1, v2){
          return {x: v1.x - v2.x,
                  y: v1.y - v2.y}
        },

  normalize: function(v){
             var magnitude = Math.sqrt( Math.pow(v.x, 2) + Math.pow(v.y, 2) ) 
             return {x: v.x/magnitude,
                     y: v.y/magnitude}
            }
}
