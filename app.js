$(document).ready(function() {
  let canvasInteractive = document.getElementById('canvas-interactive');
  let contextInteractive = document.getElementById('canvas-interactive').getContext('2d');

  let width = canvasInteractive.width = window.innerWidth;
  let height = canvasInteractive.height = window.innerHeight;

//This is a counter used in the animation timing
  let counter = 0;

//This array holds all of our columns
  let colArray = [];

//These variables control the number of columns we want to draw, and the maximum number of vertical blocks we want to draw
  let numColumns = 15;
  let maxHeight = 52;

//This object controls some attributes around the boxes - for non-clunky results, the size parameters must be less than or equal to the size of the corresponding spacing parameters
  let blockAttributes = {
    horizSize: 62,
    vertSize: 8,
    horizSpacing:64,
    vertSpacing:10
  };

//The "display" attributes are just the size of the resulting display in pixels, based on spacing/number of columns/specified height
  let displayAttributes = {
    width: blockAttributes.horizSpacing * numColumns,
    height: blockAttributes.vertSpacing * maxHeight
  };

//Constants to make sure the display is centered within the canvas element (note - this doesn't watch for canvas elements of shifting size)
  let leftOffset = (width - displayAttributes.width) / 2;
  let topOffset = (height - displayAttributes.height) / 2;

  function Block(x, y, color) {
    this.x = this.startingX = x;
    this.y = this.startingY = y;
    this.color = color;
  }

  function Column(x) {
    this.x = x + leftOffset;
    this.localBlockArray = [];
    let columnHeight = blockAttributes.vertSpacing * getRandomInt(maxHeight);
    for (let y = 0; y < columnHeight; y += blockAttributes.vertSpacing) {
      let color;
      if (y <= blockAttributes.vertSpacing * 12) color = "#1f618d";
      else if (y <= blockAttributes.vertSpacing * 24) color = "#117a65";
      else if (y <= blockAttributes.vertSpacing * 36) color = "#1e8449";
      else if (y <= blockAttributes.vertSpacing * 48) color = "#b7950b";
      else color = "#922b21";

      let newBlock = new Block(x, height-topOffset-y, color);
      this.localBlockArray.push(newBlock);
    }
  }

  Column.prototype.update = function() {
    this.localBlockArray.pop();
  };

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  function init() {
    for (let x = 0; x < blockAttributes.horizSpacing * numColumns; x += blockAttributes.horizSpacing) {
      colArray.push(new Column(x));
    }
  }

  function refreshColumn() {
    colArray.forEach(function(col){
      col.localBlockArray = [];
      let columnHeight = blockAttributes.vertSpacing * getRandomInt(maxHeight);
      for (let y = 0; y < columnHeight; y += blockAttributes.vertSpacing) {
        let color;
        if (y <= blockAttributes.vertSpacing * 12) color = "#1f618d";
        else if (y <= blockAttributes.vertSpacing * 24) color = "#117a65";
        else if (y <= blockAttributes.vertSpacing * 36) color = "#1e8449";
        else if (y <= blockAttributes.vertSpacing * 48) color = "#b7950b";
        else color = "#922b21";

        let newBlock = new Block(col.x, height-topOffset-y, color);
        col.localBlockArray.push(newBlock);
      }
    });
  }

  function decay() {
    colArray.forEach(function(col){
      col.update();
    });
  }

  function render() {
    contextInteractive.clearRect(0, 0, width, height);

    colArray.forEach(function(col){
      let blockArray = col.localBlockArray;
      blockArray.forEach(function(block){
        contextInteractive.fillStyle = block.color;
        contextInteractive.fillRect(block.x, block.y, blockAttributes.horizSize, blockAttributes.vertSize);
      });
    });
  }

  function animate() {
    //Our timeout will run fairly frequently - currently set to once every 50ms
    setTimeout(function(){
      if (counter === 0) { //Every 10th time we hit this timeout/animate, we want to redraw the columns to "pulse" the animation (this comes out to 120 BPM pulses)
        refreshColumn();
        render();
        counter = (counter+1) % 10;
        requestAnimationFrame(animate);
      }
      else { //Otherwise "decay" the existing columns
        decay();
        render();
        counter = (counter+1) % 10;
        requestAnimationFrame(animate);
      }
    }, 50);
  }

  init();
  animate();
});
