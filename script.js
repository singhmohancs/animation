
/**
 * @description 
 * @param {any} container 
 * @param {any} density 
 * @param {any} interval 
 */
function Ball(container, density, interval, iconPth) {
  this.container = jQuery(container);
  this.height = this.container.height();
  this.width = this.container.width();
  this.density = density || 5;
  this.interval = interval || 1000;
  this.logos = [];
  this.logoCount = 1;
  this.iconPth = iconPth;
}
/**
  * @description 
  * @param {any} width 
  * @param {any} height 
  */
Ball.prototype.renderLogos = function (width, height) {
  var ball = null;
  var ballValue = null;

  for (var i = 0; i < this.density; i++) {
    var x = Math.random() * this.width;
    var y = Math.random() * this.height;
    var maxMinDistance = null;
    var validPositioning = true;

    // Calculate max min distance
    for (var j = 0; j < this.logos.length; j++) {
      var logo = this.logos[j];

      var distX = (x >= logo.x) ? (x - (logo.x + logo.width)) : (logo.x - (x + width));
      var distY = (y >= logo.y) ? (y - (logo.y + logo.height)) : (logo.y - (y + height));

      // If both distances are negative, there was an overlap
      if (distX < 0 && distY < 0) {
        validPositioning = false;
        break;
      }

      // Estimate distance
      var dist = Math.sqrt((distX < 0 ? 0 : distX * distX) + (distY < 0 ? 0 : distY * distY));

      // Update max-min value
      maxMinDistance = (maxMinDistance == null) ? dist : Math.min(dist, maxMinDistance);
    }

    // Update ball if we found a better one
    if (validPositioning && (maxMinDistance == null || maxMinDistance >= ballValue)) {
      ball = { x: x, y: y };
      ballValue = maxMinDistance;
    }
  }
  if (ball) {
    var newLogo = { x: ball.x, y: ball.y, height: height, width: width };
    newLogo.node = this.createLogo(newLogo);
    newLogo.node.appendTo(this.container);
    newLogo.node.css('opacity', 1)
      .css({ transform: 'scale(0.9,0.9)' }).animate({
        opacity: '-=.5',
        transform: 'scale(50%,50%)',
        left: (this.width / 2)-(newLogo.node.width()/2),
        top: (this.height / 2)-(newLogo.node.height()/2)
      },
      2500, 'linear', function () {
        jQuery(this).fadeOut(300);
      });
    this.logos.push(newLogo);
    return true;
  }

  return false;
};
/**
  * @description 
  * @param {any} spec 
  */
Ball.prototype.createLogo = function (spec) {
  var logo = jQuery('<div class="moving-ball"><img src="' + this.iconPth + '/' + this.logoCount + '.png" /></div>');
  logo.css('height', spec.height);
  logo.css('width', spec.width);
  logo.css('top', spec.y);
  logo.css('left', spec.x);
  return logo;
};

/**
* @description 
*/
Ball.prototype.createParentLogo = function (spec) {
  var b = jQuery('<div class="parent-ball"><img src="' + this.iconPth + '/15.png" /></div>');
  b.css({
    left: (this.width / 2) - 100,
    top: (this.height / 2) - 100
  })
  b.appendTo(this.container);
};


Ball.prototype.init = function () {
  this.createParentLogo();
  window.setInterval(function () {
    this.logoCount++;
    if (this.logoCount === 14) {
      this.logoCount = 1;
    }
    // Replace with actual coordinates for logo
    var r = Math.random();
    var width = r * 100 + 50;
    var height = r * 100 + 50;

    // Try 100 times to place it
    var attempts = 100;
    while (--attempts > 0 && !this.renderLogos(width, height));

    if (this.logos.length > 14) {
      $(this.logos[0].node).fadeOut(400, function () { $(this).remove(); });
      this.logos.splice(0, 1);
    }
  }.bind(this), this.interval);
}

jQuery(function () {
  var ball = new Ball('#animation-container', 14, 1500, 'icons');
  ball.init();
});