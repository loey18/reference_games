// drawing.js
// This file contains functions to draw on the HTML5 canvas

// Draws a grid of cells on the canvas (evenly divided 
var drawGrid = function(game){
  //size of canvas
  var cw = game.viewport.width;
  var ch = game.viewport.height;

  //padding around grid
  var p = game.cellPadding / 2;

  //grid width and height
  var bw = cw - (p*2) ;
  var bh = ch - (p*2) ;
  
  game.ctx.beginPath();

  // vertical lines
  for (var x = 0; x <= bw; x += Math.floor((cw - 2*p) / game.numHorizontalCells)) {
    game.ctx.moveTo(0.5 + x + p, p);
    game.ctx.lineTo(0.5 + x + p, bh + p);
  }

  // horizontal lines
  for (var x = 0; x <= bh; x += Math.floor((ch - 2*p) / game.numVerticalCells)) {
    game.ctx.moveTo(p, 0.5 + x + p);
    game.ctx.lineTo(bw + p, 0.5 + x + p);
  }

  game.ctx.lineWidth = 1;
  game.ctx.strokeStyle = "#000000";
  game.ctx.stroke();
};

// Loop through the object list and draw each one in its specified location
var drawObjects = function(game, player) {
  _.map(game.currStim, function(obj) {
    console.log(obj);
    game.ctx.fillStyle = "#000000";
    game.ctx.fillRect(obj.trueX, obj.trueY, obj.width, obj.height);
    game.ctx.fillStyle = ('hsl(' + obj.color[0] + ',' + obj.color[1] +
			  '%, ' + obj.color[2] + '%)');
    game.ctx.fillRect(obj.trueX, obj.trueY, obj.width, obj.width);    
  });
};

var highlightCell = function(game, player) {
  if (player.role == game.playerRoleNames.role1){
    var targetObjects = _.filter(game.currStim, function(x){
      return x.targetStatus == "target";
    });
    for (var n = 0; n < targetObjects.length; n++){
      var upperLeftX = targetObjects[n].speakerCoords.gridPixelX;
      var upperLeftY = targetObjects[n].speakerCoords.gridPixelY;
      if (upperLeftX != null && upperLeftY != null) {
        game.ctx.beginPath();
        game.ctx.lineWidth="10";
        game.ctx.strokeStyle="black";
        game.ctx.rect(upperLeftX + 5, upperLeftY + 5,290,290); 
        game.ctx.stroke();
      }
    }
  }
};

function drawOnCanvas(plots) {
  var ctx = globalGame.sketchCTX;
  ctx.beginPath();
  ctx.moveTo(plots[0].x, plots[0].y);

  for(var i=1; i<plots.length; i++) {
    ctx.lineTo(plots[i].x, plots[i].y);
  }
  ctx.stroke();
}

// var drawGridNums = function(game, player) {

//   // for (var gridNumber=1; gridNumber++; gridNumber<=2) {
//   //   for (var x=25; x++; x < 1800) {
//   //     game.ctx.font = '40pt Calibri';
//   //     game.ctx.fillStyle = 'blue';
//   //     game.ctx.fillText(gridNumber, x, 70);
//   //   }
//   // }

// // var numberCells = 6
// // var topGridNums = 1;
// // var bottomGridNums = 7;

// var numberCells = 3
// var topGridNums = 1;
// var bottomGridNums = 4;

// var topX = 40;
// // var bottomX = 40;
// var topY = 70;
// // var bottomY = 370;

//     // ensure text is left-aligned
//     game.ctx.textAlign = 'left';
//      //top cells
//      _.map(_.range(numberCells), function(v) {
//       game.ctx.font = '40pt Calibri';
//       game.ctx.fillStyle = 'blue'; 
//       game.ctx.fillText(topGridNums, topX, topY);
//       topGridNums++;
//       topX= topX + 300;
//     });    
//     //  //bottom cells
//     // _.map(_.range(numberCells), function(v) {
//     //   game.ctx.font = '40pt Calibri';
//     //   game.ctx.fillStyle = 'blue'; 
//     //   game.ctx.fillText(bottomGridNums, bottomX, bottomY);
//     //   bottomGridNums++;
//     //   bottomX = bottomX + 300;
//     // });   
//   };





var drawScreen = function(game, player) {
  // draw background
  game.ctx.fillStyle = "#FFFFFF";
  game.ctx.fillRect(0,0,game.viewport.width,game.viewport.height);
  
  // Draw message in center (for countdown, e.g.)
  if (player.message) {
    game.ctx.font = "bold 23pt Helvetica";
    game.ctx.fillStyle = 'blue';
    game.ctx.textAlign = 'center';
    wrapText(game, player.message, 
             game.world.width/2, game.world.height/4,
             game.world.width*4/5,
             25);
  }
  else {
    // eraseHighlight(game, player, upperLeftY, upperLeftY);
    drawGrid(game);
    drawObjects(game, player);  
    highlightCell(game, player);    
    // //draw grid numbers
    // drawGridNums(game, player);
  }

};

// This is a helper function to write a text string onto the HTML5 canvas.
// It automatically figures out how to break the text into lines that will fit
// Input:
//    * game: the game object (containing the ctx canvas object)
//    * text: the string of text you want to writ
//    * x: the x coordinate of the point you want to start writing at (in pixels)
//    * y: the y coordinate of the point you want to start writing at (in pixels)
//    * maxWidth: the maximum width you want to allow the text to span (in pixels)
//    * lineHeight: the vertical space you want between lines (in pixels)
function wrapText(game, text, x, y, maxWidth, lineHeight) {
  var cars = text.split("\n");
  game.ctx.fillStyle = 'white';
  game.ctx.fillRect(0, 0, game.viewport.width, game.viewport.height);
  game.ctx.fillStyle = 'red';

  for (var ii = 0; ii < cars.length; ii++) {

    var line = "";
    var words = cars[ii].split(" ");

    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + " ";
      var metrics = game.ctx.measureText(testLine);
      var testWidth = metrics.width;

      if (testWidth > maxWidth) {
        game.ctx.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      }
      else {
        line = testLine;
      }
    }
    game.ctx.fillText(line, x, y);
    y += lineHeight;
  }
}
