let aWidth, aHeight, gX, gY, gW, gH;
let slider;
let v1 = 330,
  v2 = 600,
  h = 100;
let blueLine = [],
  redLine = [],
  greenLine = [];
let x_dist = 0,
  y_time = 0;
let maxDist = 1000,
  maxTime = 4;
let lW = 1300,
  lH = 50;
let modeToggle;

let currentMode = 'default';
function setup() {
  aWidth = windowWidth;
  aHeight = windowHeight;
  gW = aWidth * 0.5;    // Graph width as 50% of canvas width
  gH = aHeight * 0.5;   // Graph height as 50% of canvas height
  gX = aWidth * 0.05;   // Offset from the left of canvas
  gY = aHeight * 0.05;  // Offset from the top of canvas

  createCanvas(aWidth, aHeight);
  slider = createSlider(5, 500, 10);
  slider.position(10, 10);
  slider.size(500);
  slider.addClass("mySliders");




    // Create toggle button using radio buttons
  modeToggle = createRadio();
  modeToggle.option('default', 'Main');
  modeToggle.option('linesOnly', 'Lines');
  modeToggle.option('shapesOnly', 'Seismic Waves');
  modeToggle.selected('default');

  const drawBottomY = gY + gH + 60; // Add padding below the graph
  modeToggle.position(gX-40, drawBottomY);

    // Apply custom CSS styles to the radio buttons
  // Apply custom styles
  modeToggle.style('font-size', '18px'); // Increase font size
  modeToggle.style('color', '#333'); // Dark gray text
  modeToggle.style('margin-left', '30px'); // Add left margin to create spacing
  modeToggle.style('padding', '10px 20px'); // Add padding for a clean layout
  modeToggle.style('background-color', '#f0f0f0'); // Light gray background
  modeToggle.style('border-radius', '8px'); // Rounded corners
  modeToggle.style('border', '1px solid #ccc'); // Light border
  modeToggle.style('display', 'block'); // Ensure proper block alignment
  modeToggle.style('cursor', 'pointer'); // Change cursor to pointer

  // Add spacing between options by targeting each child
  let options = modeToggle.elt.querySelectorAll('label');
  options.forEach(option => {
    option.style.marginBottom = '10px'; // Add padding below each option
    option.style.display = 'block'; // Ensure each option is displayed on a new line
  });


  modeToggle.changed(handleModeChange);



}




// Event listener for mode changes
function handleModeChange() {
  const mode = modeToggle.value();

  if (mode === 'linesOnly' || mode === 'shapesOnly') {
    console.log('Pausing animation for mode:', mode);
    noLoop(); // Pause the animation
    redraw(); // Redraw for the new mode
  } else if (mode === 'default') {
    console.log('Resuming animation for mode:', mode);
    loop(); // Resume animation
  }

  currentMode = mode; // Update the current mode
}

function draw() {
  background(255);
  let d = slider.value();
  frameRate(d);

  // Draw the graph
  drawGraph(gX, gY + gH, 25, 25, "Distance(km)", "Time (s)");

  // Call myAnimation with the current mode
  myAnimation(20, currentMode);
}


function windowResized() {
  // Check if variables are defined before using them
  if (typeof aWidth !== 'undefined' && typeof aHeight !== 'undefined') {
    // Adjust canvas size when the window is resized
    aWidth = windowWidth;
    aHeight = windowHeight;
    resizeCanvas(aWidth, aHeight);

    // Update graph dimensions based on new canvas size
    gW = aWidth * 0.5;
    gH = aHeight * 0.5;
    gX = aWidth * 0.05;
    gY = aHeight * 0.05;

    console.log("Canvas resized:", aWidth, aHeight);
  } else {
    console.log("Canvas variables are not defined yet.");
  }
}