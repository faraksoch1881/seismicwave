let firstX = null; // Variable to store the first x value

function drawPin(x, y, pinWidth, pinHeight, hatDiameter) {
  // Draw the cylinder (pin body)
  fill(150); // Set color for the cylinder
  if (firstX === null) {
    // Store the first x value
    firstX = x;
  }

  if (x === firstX) {
    // Call drawBlast for the first x value
    drawBlast(x + pinWidth / 2, y);
  } else {
    // Action for all other x values
    // Draw the cylinder (pin body)
    fill(150); // Set color for the cylinder
    rect(x, y, pinWidth, pinHeight);

    // Draw the hat (top rounded part)
    fill(200); // Set color for the hat
    ellipse(x + pinWidth / 2, y, hatDiameter, hatDiameter / 2);
  }
}

let blastRadius = 0;
let blastOpacity = 255;
let blastActive = false;

function drawBlast(x, y) {
  push();
  noFill();
  stroke(255, 100, 0, blastOpacity); // Orange color with fading effect
  strokeWeight(4);

  // Draw expanding circles for the blast effect
  for (let i = 0; i < 5; i++) {
    ellipse(x-5, y+10, blastRadius + i * 20, blastRadius + i * 20);
  }

  // Increase blast radius and decrease opacity to animate
  blastRadius += 1;
  blastOpacity -= 5;

  // Reset the blast effect once it fades out
  if (blastOpacity <= 0) {
    blastRadius = 0;
    blastOpacity = 255;
  }

  pop();
}



function drawGraph(oX, oY, xN, yN, xAxisTitle, yAxisTitle) {
  // Set text color to black for all labels and titles
  fill(0);

  //graph
  push();
  noFill();
  strokeWeight(1.5);
  stroke(0);
  rect(gX, gY, gW, gH);

  //x-scale
// x-scale (increments of 5)
let yGap = 5;
let y1 = oY - yGap;
let y2 = oY + yGap;
for (let v = 0; v <= xN; v += 5) { // Increment by 5
  let x1, x2;
  x1 = x2 = map(v, 0, xN, oX, oX + gW);
  line(x1, y1, x2, y2);
  // x-axis labels
  textAlign(CENTER, TOP);
  text(v, x1, oY + 15); // Add some space below the axis for the text
}

// y-scale (increments of 5)
let xGap = 5;
let x1 = oX - xGap;
let x2 = oX + xGap;
for (let v = 0; v <= yN; v += 5) { // Increment by 5
  let y1, y2;
  y1 = y2 = map(v, 0, yN, oY - gH, oY); // Start from top (0) to bottom (yN)
  line(x1, y1, x2, y2);
  // y-axis labels
  textAlign(RIGHT, CENTER);
  text(v, oX - 10, y1); // Add some space to the left of the axis for the text
}

  // Background grid lines for x-axis
  stroke(220); // Grey color for the lines
  let spacing = gW / xN; // Calculate the spacing based on xN
  for (let i = 1; i < xN; i++) { // Start from 1 to avoid line at the very edge
    let xPosition = oX + i * spacing;
    line(xPosition, oY, xPosition, oY - gH); // Draw line from bottom to top
  }
  fill(0);
  // x-axis title
  textAlign(CENTER, TOP);
  textSize(14);
  text(xAxisTitle, oX + gW / 2, oY + 40); // Adjust y position as needed

  // y-axis title
  push();
  textAlign(CENTER, CENTER);
  textSize(14);
  translate(oX - 35, oY - gH / 2); // Position the y-axis title to the left
  rotate(-HALF_PI); // Rotate text for y-axis
  text(yAxisTitle, 0, 0);
  pop();

  pop();
}




function drawCurve(points, color) {
  push();
  strokeWeight(3);
  stroke(color);
  noFill();
  beginShape();

  for (let point of points) {
    // Only draw red and blue lines if x > 10
    if ((color === "red" || color === "blue") && point.x <= 10) {
      continue; // Skip this point if x <= 10
    }

    let x = map(point.x, 0, maxDist, gX, gX + gW);
    let y = map(point.y, 0, maxTime, gY, gY + gH);

    // Check if the point is within the bounds of the rectangle
    if (x >= gX && x <= gX + gW && y >= gY && y <= gY + gH) {
      vertex(x, y);
    }
  }

  endShape();
  pop();
}


let intersectionPoints = []; // Store intersection points persistently
let intersectedLines = new Set(); // Track intersected lines


function checkIntersection(points, color) {
  let spacing = gW / 25; // Adjust according to the number of grey lines
  for (let point of points) {
    let x = map(point.x, 0, maxDist, gX, gX + gW);
    for (let i = 1; i < 25; i++) {
      let xPosition = gX + i * spacing;

      if (abs(x - xPosition) < 5 && !intersectedLines.has(`${color}-${i}`)) {
        intersectionPoints.push({
          x: xPosition,
          y: map(point.y, 0, maxTime, gY, gY + gH), // Flipped y-axis
          color: color,
          time: millis(),
        });
        intersectedLines.add(`${color}-${i}`);
        break;
      }
    }
  }
}


function drawBlueArrowheads() {
   let alphaValue = arrowheadTransparency; // Get current transparency
  noStroke();
   let blueIntersections = intersectionPoints.filter(p => p.color === "blue");
 for (let i = 0; i < blueIntersections.length; i++) {
  let point = blueIntersections[i];
    // Only draw arrowheads after the fifth intersection point for the red line
    if (i >= 2) {
      push();
      translate(point.x + 10, point.y +5); // Move to intersection point

       // Draw white background rectangle to mask grey line
      fill(225); // White color
      rect(-10, -10, 2, 20); // Rectangle covers the area between top left and bottom left
      
      // Draw the teardrop/arrow-like shape
      fill(0, 0, 255, alphaValue); // Blue color with transparency

beginShape();
  vertex(-9, -9);
    vertex(-8, -8);
      vertex(-7, -7);
  vertex(-6, -6);
  vertex(-4, -5); // Smoother transition to round the upper part
  vertex(-2, -4); // Smooth curve on the upper side
  vertex(0, -3);  // Move towards center in a curve
  vertex(2, -2);  // Round curve
  vertex(3.5, 0);   // Center of the tip (rounded edge)
  vertex(2, 2);   // Round curve on the bottom side
  vertex(0, 3);   // Move back to the left
  vertex(-2, 4);  // Smooth curve on the lower side
  vertex(-4, 5);  // Smoother transition to round the lower part
  vertex(-7, 8);  
  vertex(-8, 9);  
  vertex(-9, 10);  

  // Main body of the shape
  vertex(-8, -10);       // Top left corner
  vertex(-4, -1);          // Center of the base (left side)
  vertex(-8, 10);        // Bottom left corner
endShape(CLOSE);



 fill(0, 0, 255, alphaValue); // Blue color with transparency 
beginShape();
vertex(-18, -13);               // Tip of the first arrow (pointing right)
vertex(-20, -15);               // Tip of the first arrow (pointing right)
vertex(-18, -17);           // Slightly below left of the tip to create a rounded edge
vertex(-10, -20);              // Top left corner
vertex(-14, -15);               // Center of the base (left side)
vertex(-10, -10);              // Bottom left corner
endShape(CLOSE);

 fill(0, 0, 255, alphaValue); // Blue color with transparency
beginShape();
vertex(-18, 17);               // Tip of the first arrow (pointing right)
vertex(-20, 15);               // Tip of the first arrow (pointing right)
vertex(-18, 13);           // Slightly below left of the tip to create a rounded edge
vertex(-10, 10);              // Top left corner
vertex(-14, 15);               // Center of the base (left side)
vertex(-10, 20);              // Bottom left corner
endShape(CLOSE);






      pop();

    }
  }
}


function drawRedArrowheads() {
   let alphaValue = arrowheadTransparency; // Get current transparency
  noStroke();
   let redIntersections = intersectionPoints.filter(p => p.color === "red");
 for (let i = 0; i < redIntersections.length; i++) {
    let point = redIntersections[i];

    // Only draw arrowheads after the fifth intersection point for the red line
    if (i >= 8) {
      push();
      translate(point.x + 10, point.y +5); // Move to intersection point

       // Draw white background rectangle to mask grey line
      fill(255); // White color
      rect(-10, -10, 2, 20); // Rectangle covers the area between top left and bottom left
      
      // Draw the teardrop/arrow-like shape
       fill(255, 0, 0, alphaValue); // Red color with transparency

beginShape();
  vertex(-9, -9);
    vertex(-8, -8);
      vertex(-7, -7);
  vertex(-6, -6);
  vertex(-4, -5); // Smoother transition to round the upper part
  vertex(-2, -4); // Smooth curve on the upper side
  vertex(0, -3);  // Move towards center in a curve
  vertex(2, -2);  // Round curve
  vertex(3.5, 0);   // Center of the tip (rounded edge)
  vertex(2, 2);   // Round curve on the bottom side
  vertex(0, 3);   // Move back to the left
  vertex(-2, 4);  // Smooth curve on the lower side
  vertex(-4, 5);  // Smoother transition to round the lower part
  vertex(-7, 8);  
  vertex(-8, 9);  
  vertex(-9, 10);  

  // Main body of the shape
  vertex(-8, -10);       // Top left corner
  vertex(-4, -1);          // Center of the base (left side)
  vertex(-8, 10);        // Bottom left corner
endShape(CLOSE);



 fill(255, 0, 0, alphaValue); // Red color with transparency
beginShape();
vertex(-18, -13);               // Tip of the first arrow (pointing right)
vertex(-20, -15);               // Tip of the first arrow (pointing right)
vertex(-18, -17);           // Slightly below left of the tip to create a rounded edge
vertex(-10, -20);              // Top left corner
vertex(-14, -15);               // Center of the base (left side)
vertex(-10, -10);              // Bottom left corner
endShape(CLOSE);

 fill(255, 0, 0, alphaValue); // Red color with transparency
beginShape();
vertex(-18, 17);               // Tip of the first arrow (pointing right)
vertex(-20, 15);               // Tip of the first arrow (pointing right)
vertex(-18, 13);           // Slightly below left of the tip to create a rounded edge
vertex(-10, 10);              // Top left corner
vertex(-14, 15);               // Center of the base (left side)
vertex(-10, 20);              // Bottom left corner
endShape(CLOSE);


      pop();

    }
  }
}


function drawGreenArrowheads() {
   let alphaValue = arrowheadTransparency; // Get current transparency
  noStroke();
  let greenIntersections = intersectionPoints.filter(p => p.color === "green");
  for (let point of greenIntersections) {
    // Only draw if 0.5 seconds (500 milliseconds) have passed since the intersection
    if (millis() - point.time > 0) {
      push();
      translate(point.x + 10, point.y+5 ); // Move to intersection point
      
      // Draw white background rectangle to mask grey line
      fill(225); // White color
      rect(-10, -10, 2, 20); // Rectangle covers the area between top left and bottom left
      
      // Draw the teardrop/arrow-like shape
      fill(0, 255, 0, alphaValue); // Green color with transparency

beginShape();
  vertex(-9, -9);
    vertex(-8, -8);
      vertex(-7, -7);
  vertex(-6, -6);
  vertex(-4, -5); // Smoother transition to round the upper part
  vertex(-2, -4); // Smooth curve on the upper side
  vertex(0, -3);  // Move towards center in a curve
  vertex(2, -2);  // Round curve
  vertex(3.5, 0);   // Center of the tip (rounded edge)
  vertex(2, 2);   // Round curve on the bottom side
  vertex(0, 3);   // Move back to the left
  vertex(-2, 4);  // Smooth curve on the lower side
  vertex(-4, 5);  // Smoother transition to round the lower part
  vertex(-7, 8);  
  vertex(-8, 9);  
  vertex(-9, 10);  

  // Main body of the shape
  vertex(-8, -10);       // Top left corner
  vertex(-4, -1);          // Center of the base (left side)
  vertex(-8, 10);        // Bottom left corner
endShape(CLOSE);



fill(0, 255, 0, alphaValue); // Green color with transparency
beginShape();
vertex(-18, -13);               // Tip of the first arrow (pointing right)
vertex(-20, -15);               // Tip of the first arrow (pointing right)
vertex(-18, -17);           // Slightly below left of the tip to create a rounded edge
vertex(-10, -20);              // Top left corner
vertex(-14, -15);               // Center of the base (left side)
vertex(-10, -10);              // Bottom left corner
endShape(CLOSE);

fill(0, 255, 0, alphaValue); // Green color with transparency
beginShape();
vertex(-18, 17);               // Tip of the first arrow (pointing right)
vertex(-20, 15);               // Tip of the first arrow (pointing right)
vertex(-18, 13);           // Slightly below left of the tip to create a rounded edge
vertex(-10, 10);              // Top left corner
vertex(-14, 15);               // Center of the base (left side)
vertex(-10, 20);              // Bottom left corner
endShape(CLOSE);






      pop();
    }
  }
}


function myAnimation(xN,mode = 'default') {

  //capping time
  if (y_time >= maxTime - 1.7) {
    x_dist = 0;
    y_time = 0;
    greenLine = [];
    redLine = [];
    blueLine = [];
        intersectedLines.clear(); // Clear intersected lines when restarting animation
    intersectionPoints = []; // Clear intersection points when restarting animation
  }

  //calculating curve points
  if (mode !== 'linesOnly' && mode !== 'shapesOnly') {
    // Calculate curve points only for default mode
    greenLine.push({ x: x1(y_time), y: y_time });
    blueLine.push({ x: x2(y_time), y: y_time });
    redLine.push({ x: x3(y_time), y: y_time });
    y_time += 0.005556;
  }


 if (mode === 'default') {
    // Default mode: show everything
    checkIntersection(greenLine, "green");
    checkIntersection(blueLine, "blue");
    checkIntersection(redLine, "red");
    drawBlueArrowheads();
    drawRedArrowheads();
    drawGreenArrowheads();
    drawCurve(blueLine, "blue");
    drawCurve(greenLine, "green");
    drawCurve(redLine, "red");
  } else if (mode === 'linesOnly') {
    // Only draw lines (hide arrowheads)
    drawCurve(blueLine, "blue");
    drawCurve(greenLine, "green");
    drawCurve(redLine, "red");

  } else if (mode === 'shapesOnly') {
    // Only draw arrowheads (hide lines)
        checkIntersection(greenLine, "green");
    checkIntersection(blueLine, "blue");
    checkIntersection(redLine, "red");
    drawBlueArrowheads();
    drawRedArrowheads();
    drawGreenArrowheads();

  }

  //drwing layers of earth
  noStroke();
  fill(200, 200, 255);
  rect(gX + gW + 10, gY + 50, 900, 150);
  fill(150, 150, 255);
  rect(gX + gW + 10, gY + 150 + 50, 900, 150);


fill(0); // Set the text color to black
textSize(20); // Set the text size
text("Geophones", gX + gW + 10 + 450, gY + 30); // Center text above the first rectangle



  let pinY = gY + 40 ; // Adjust vertical position for pins above the first layer
  let pinWidth = 8;
  let pinHeight = 10;
  let hatDiameter = 12;

  for (let v = 0; v < xN; v++) {
    // Calculate x position for each pin across the width of the first rectangle
    let pinX = map(v, 0, xN - 1, gX + gW + 10, gX + gW + 10 + 900 - pinWidth);
    drawPin(pinX, pinY, pinWidth, pinHeight, hatDiameter);
  }


// Adding text and red circle below the last layer
let baseY = gY + 150 + 50 + 150 + 20; // Position below the last layer
let circleX = gX + gW + 10 + 20; // Position of the red circle on the left
let textX = circleX + 50; // Position of the text, with spacing to the right of the circle

// Function to draw circle and text at a specific Y position
function drawCircleAndText(y, circleColor, textColor, textContent) {
  // Draw the red circle
  fill(circleColor);
  ellipse(circleX, y, 20, 20); // Adjust size and position as needed

  // Add the text
  fill(textColor); // Black text color
  textSize(16); // Adjust text size as needed
  text(textContent, textX, y + 5); // Adjust Y position for alignment
}

// Draw the first circle and text
drawCircleAndText(baseY, "blue", 0, "Critical Distance");

// Draw the second circle and text
let secondY = baseY + 30; // Add vertical spacing for the second row
drawCircleAndText(secondY, "red", 0, "Cross over distance");





  //tracing wave path
  redWave(redLine);
  greenWave(greenLine);
  blueWave(blueLine);

  //intersection points of curves

  stroke("red");
  strokeWeight(15);



  //red-green intersection
  point(
    map(40 * sqrt(85), 0, maxDist, gX, gX + gW),
    map(sqrt(85) / 9, 0, maxTime, gY , gY+ gH)
  );

  stroke("blue");
  strokeWeight(15);


  //red-blue intersection
  point(
    map(240 * sqrt(5 / 17), 0, maxDist, gX, gX + gW),
    map((11 / 9) * sqrt(5 / 17), 0, maxTime, gY , gY+ gH)
  );
}




function greenWave(points) {
  beginShape();
  noFill();
  stroke("green");
  strokeWeight(4);
  let y = gY + 50;
  for (let point of points) {
    let x = point.x;
    x = map(x, 0, maxDist, gX + gW + 10, gX + gW + 10 + lW);
    vertex(x, y);
  }
  endShape();
}

function redWave(points) {
  beginShape();
  noFill();
  stroke("red");
  strokeWeight(3);
  let initialTime = (5 * sqrt(85)) / 99;
  let finalTime = sqrt(85) / 9;
  let totalTime = finalTime - initialTime;
  let firstHalf = (finalTime - initialTime) / 10 + initialTime;
  let secondHalf = ((finalTime - initialTime) * 8) / 10 + initialTime +0.06;
  let initialDistance = 0;
  let finalDistance = 40 * sqrt(85);
  let totalDistance = finalDistance - initialDistance;
  let xvel = (totalDistance / totalTime) * 0.005556;
  let yvel = 14;
  let x = 0;
  let y = gY + 50;
  let xx = map(x, 0, maxDist, gX + gW + 10, gX + gW + 10 + lW);
  vertex(xx, y);
  for (let point of points) {
    if (point.y > initialTime && point.y < firstHalf) {
      x += xvel;
      xx = map(x, 0, maxDist, gX + gW + 10, gX + gW + 10 + lW);
      y += yvel;
      vertex(xx, y);
    }
    if (point.y > firstHalf && point.y < secondHalf) {
      x += xvel;
      xx = map(x, 0, maxDist, gX + gW + 10, gX + gW + 10 + lW);
      vertex(xx, y);
    }
    if (point.y > secondHalf && point.y < finalTime) {
      x += xvel;
      xx = map(x, 0, maxDist, gX + gW + 10, gX + gW + 10 + lW);
      y -= yvel;
      vertex(xx, y);
    }
    if (point.y >= finalTime) {
      y = gY + 50;
      x += xvel;
      xx = map(x, 0, maxDist, gX + gW + 10, gX + gW + 10 + lW);
      vertex(xx, y);
    }
  }
  endShape();
}

function blueWave(points) {
  beginShape();
  noFill();
  stroke("blue");
  strokeWeight(5);
  let initialTime = 0.555555556;
  let finalTime = (sqrt(5 / 17) * 11) / 9;
  let totalTime = finalTime - initialTime;
  let halfTime = (finalTime + initialTime) / 2;
  let initialDist = 0;
  let finalDist = 240 * sqrt(5 / 17);
  let totalDist = finalDist - initialDist;
  let xvel = (totalDist / totalTime) * 0.005556;
  let yvel = 13;
  let x = 0;
  let y = gY + 50;
  let xx = map(x, 0, maxDist, gX + gW + 10, gX + gW + 10 + lW);
  vertex(xx, y);
  for (let point of points) {
    if (point.y > initialTime && point.y < halfTime) {
      x += xvel;
      xx = map(x, 0, maxDist, gX + gW + 10, gX + gW + 10 + lW);
      y += yvel;
      vertex(xx, y);
    }
    if (point.y > halfTime && point.y < finalTime) {
      x += xvel;
      xx = map(x, 0, maxDist, gX + gW + 10, gX + gW + 10 + lW);
      y -= yvel;
      vertex(xx, y);
    }
    if (point.y >= finalTime) {
      y = gY + 50;
      x = map(point.x, 0, maxDist, gX + gW + 10, gX + gW + 10 + lW);
      vertex(x, y);
    }
  }
  endShape();
}

function myDelay(x) {
  let a = 1;
  while (a < 150000000 / x) {
    a++;
    a--;
    a++;
  }
}
