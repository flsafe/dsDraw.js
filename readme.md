<html>  

  <head>  
    <title>dsDraw</title> 

    <style type="text/css">  
      canvas { border: 1px solid black; }  
    </style> 

    <script type="text/javascript" src="dsDraw.js"></script>

    <script type="text/javascript">
      
      function draw(){  
        var canvas = document.getElementById('tutorial')
        if (canvas.getContext){  
          var ctx = canvas.getContext('2d');  
          
          ctx.save()
            var array = ["a", "b", "c", "d", "e", "f", "\\0"]
            drawDelete(array, 2, ctx)
          
            ctx.translate(0, 150)

            var array2 = ["an apple", 1, 100, null]
            drawArray(array2, ctx)
          ctx.restore()
        }  
      }  
    </script>

  </head>  

  <body onload="draw();">  
    <canvas id="tutorial" width="800" height="600"></canvas>  
  </body>  
</html>  

![example](example.png)