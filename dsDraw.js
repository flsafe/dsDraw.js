var dsDraw = {
  startPosition: {x: 25, y: 25}
}

var arrayDrawer = function(spec){
  spec = spec || {}
  var that = {}

  var subject
  var context 
  var cellWidth
  var startPosition = dsDraw.startPosition
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
    pixelsPerChar = spec.pixelsPerChar || pixelsPerChar
    cellWidth = spec.cellWidth || arrayCellWidth(subject, pixelsPerChar)
    arrayHeight = spec.arrayHeight || arrayHeight
    fontSize = spec.fontSize || fontSize
  }

  var arrayCellWidth= function(array, ppChar){
    if(array.length === 0)
      return 0

    ppChar = ppChar || pixelsPerChar

    array = toStringArray(array)
    var max = array[0].length * ppChar 
    var current;
    for(i = 0 ; i < array.length ; i++){
      current = array[i].length * ppChar 
      if(current > max){
        max = current
      }
    }
    return max
  }
  that.arrayCellWidth = arrayCellWidth

  function toStringArray(array){
    var out = new Array(array.length)

    for( i = 0 ; i < array.length ; i++){
      out[i] = elementToString( array[i] )
    }
    return out
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
    drawer.drawVertStroke(currPos, arrayHeight, context)
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
  spec = spec || {}
  var that = {}

  initialize()
  function initialize(){}
  
  var draw = function(from, to, ctx){
    ctx.save()
      ctx.beginPath()
        ctx.moveTo(from.x, from.y)
        ctx.lineTo(to.x, to.y)
      ctx.stroke()
    ctx.restore()
  }
  that.draw = draw 

  var drawVertStroke = function(start, strokeHeight, ctx){
    var to = {x:start.x, y:start.y + strokeHeight} 
    draw(start, to, ctx)
  }
  that.drawVertStroke = drawVertStroke

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

var arrowStippleDrawer = function(spec){
  spec = spec || {}
  var that = {}

  var arrow 
  var arrowHeight = 30
  var spaceBetween = 30
  var arrowHeadOffset = 0 
  initialize()

  function initialize(){
    arrow = arrowDrawer(spec)
    arrowHeight = spec.arrowHeight || arrowHeight
    spaceBetween = spec.spaceBetween || spaceBetween
    arrowHeadOffset = spec.arrowHeadOffset || arrowHeadOffset
  }

  var draw= function(count, ctx){
    ctx.save()
      var arrowTail = dsDraw.startPosition
       for(i = 0 ; i < count ; i++){
        arrowHead = applyOffset( {x: arrowTail.x, 
                                  y: arrowTail.y + arrowHeight} )
        arrow.draw(arrowTail, arrowHead, ctx)
        ctx.translate(spaceBetween, 0); 
       }
    ctx.restore()
  }
  that.draw= draw

  function applyOffset(p){
    return {x: p.x + arrowHeadOffset, y: p.y}
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
