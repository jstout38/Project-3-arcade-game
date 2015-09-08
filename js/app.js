//////////////////////////
// The main game object //
//////////////////////////

var Game = function() {
    // These variables track the various parameters of the game. Creating a new Game object initializes to the following conditions.
    // gameHasStarted determines whether the game has actually started or whether the player is at the menu, score is the player's score
    // lives is the number of lives remaining, characters is an array storing the character sprites
    // gameOver determines whether the game has ended and cursorPosition tracks the character selection cursor, determining which player is active
    this.gameHasStarted = false;
    this.score = 0;
    this.lives = 5;
    this.characters = ['images/char-boy.png', 'images/char-cat-girl.png', 'images/char-horn-girl.png', 'images/char-pink-girl.png', 'images/char-princess-girl.png'];
    this.resetGame = false;
    this.gameOver = false;
    this.cursorPosition = 2;
    this.level = new Level;
};

Game.prototype.renderCursor = function() {
    // Renders the selector during the intial menu screen
    ctx.drawImage(Resources.get('images/Selector.png'), game.cursorPosition * 202, 405);
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// An object to track variables for the current level. Creates new heart and star objects for the level and sets them to random positions//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var Level = function () {
    // Set a random value 0-4 for which column will have the exit (ignores the first and last column)
    this.exitPosition = Math.floor(Math.random() * 7) + 1;
    this.heart = new Heart;
    randomPosition(this.heart);
    this.star = new Star;
    randomPosition(this.star);
    while (this.heart.x === this.star.x && this.heart.y === this.star.y) {
        randomPosition(this.star);
    }
};

///////////////////////////////////
// Enemies our player must avoid //
///////////////////////////////////

var Enemy = function(row, start) {
    // sprite is the image for the enemy, x is the horizontal position where the enemy starts, y is the vertical position determined by the enemy's row
    // speed is a multiplier between .5 and 1.5
    this.sprite = 'images/enemy-bug.png';
    this.x = start;
    this.y = row * 83 - 20;
    this.speed = Math.random() + 0.5;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Multiplies the time delta by the speed and a constant determined through testing to achieve reasonable speeds and uses it to adjust the x position
    this.x = this.x + dt * 150 * this.speed;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/////////////////////////////////////////////////////////////////
// Item objects that serve as a prototype for hearts and stars //
/////////////////////////////////////////////////////////////////

var Item = function() {
    // Initiatilizes a heart using the image in sprite at a random x and y position that conforms to the game grid.
    this.x;
    this.y;
    this.show = true;
};

Item.prototype.render = function() {
    // Renders the item but only if it is supposed to currently show
    if (this.show) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

Item.prototype.itemCollisionCheck = function() {
    // Checks if the player collides with the item and returns true or false.
    if (this.show) {
        if (!(player.x > this.x + 85 || player.x +101 < this.x + 16 || player.y + 73 > this.y + 140 || player.y +143 < this.y + 60)) {
            return true;
        }
    }
    return false;
};

function randomPosition(item) {
    // Set an item to a random position on the stone squares (ignores the first and last column)
    item.x = (Math.floor(Math.random()*7) + 1) * 101;
    item.y = (Math.floor(Math.random()*3) + 1) * 83 - 10;
}

var Heart = function() {
    // Having an extra heart available on every level would be over kill, so each level has a 20% chance of actually using the heart object.
    // The show variable is what determines whether the heart is actually available to the player.
    this.sprite = 'images/Heart.png';
    if (Math.random() < 0.8) {
        this.show = false;
    }
};

// Set the prototype for heart objects to Item.
Heart.prototype = new Item();
Heart.prototype.constructor = Heart;


var Star = function() {
    // Constructor for star objects
    this.sprite = 'images/Star.png';
};

// Set the prototype for star objects to Item.
Star.prototype = new Item();
Star.prototype.constructor = Star;


//////////////////////////////
// The main player function //
//////////////////////////////

var Player = function() {
    // Initializees the character based on what character was selected in the menu screen. The character always starts at the same position.
    this.sprite = game.characters[game.cursorPosition];
    this.x = 202;
    this.y = 405;
};

// Checks for win condition or collisions
Player.prototype.update = function() {
    if (this.y === -10) {
        // Player has reached the top of the screen. Reset the player, increase the score, create a new level, create a new heart.
        player = new Player();
        game.score += 10;
        game.level = new Level();
    }
    if (this.collisionCheck()) {
        // Player has collided with an enemy, Reset the player, subtract a life, check to see if the game is over (0 lives).
        player = new Player();
        game.lives--;
        if (game.lives < 1) {
            game.gameOver = true;
        }
    }
    if (game.level.heart.itemCollisionCheck()) {
        // Player has collided with a heart. Remove the heart and add a life.
        game.level.heart.show = false;
        game.lives++;
    }
    if (game.level.star.itemCollisionCheck()) {
        // Player has collided with a star. Remove the star and add 5 points.
        game.level.star.show = false;
        game.score += 5;
    }
};

// Check for collision with enemy
Player.prototype.collisionCheck = function() {
    for (var i = 0; i < allEnemies.length; i++) {
        if (!(allEnemies[i].x > this.x + 85 || allEnemies[i].x +101 < this.x + 16 ||
                 allEnemies[i].y + 73 > this.y + 140 || allEnemies[i].y +143 < this.y + 60)) {
            return true;
        }
    }
    return false;
};

// Input handling
Player.prototype.handleInput = function(keyCode) {
    if (game.gameHasStarted) {
    // Main game controls. Check bounds in each direction while also considering the exit position. Q also will bring up the reset menu. Enter resets the game at the game over screen.
        if (!game.resetGame) {
            if (keyCode === 'left' && this.x > 0) {
                this.x = this.x - 101;
            }
            else if (keyCode === 'up' && this.y > 0) {
                if (this.y > 83 || this.x  === game.level.exitPosition * 101) {
                    this.y = this.y - 83;
                }
            }
            else if (keyCode === 'right' && this.x < 808) {
                this.x = this.x + 101;
            }
            else if (keyCode === 'down' && this.y < 405) {
                this.y = this.y + 83;
            }
            else if (keyCode === 'q' && !(game.gameOver)) {
                game.resetGame = true;
            }
            else if (keyCode === 'enter' && game.gameOver) {
                game = new Game;
            }
        }
        else {
        // Handles input when the reset screen is up.
            if (keyCode === 'y') {
                game = new Game;
            }
            else if (keyCode === 'n') {
                game.resetGame = false;
            }
        }
    }
    else {
    // Controls for the menu screen (!gameHasStarted)
        if (keyCode === 'left' && game.cursorPosition > 0) {
            game.cursorPosition--;
        }
        else if (keyCode== 'right' && game.cursorPosition < 4) {
            game.cursorPosition++;
        }
        else if (keyCode === 'enter') {
            // Start the game and create a new player with the selected sprite upon pressing Enter
            game.gameHasStarted = true;
            player = new Player;
        }
    }
};

// Draw the player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Add 50 enemies to the array
function addEnemies() {
    //Picks a random row for each enemy and places them at an interval of 150 pixels. Each new enemy object wil also have a random speed as determined within the enemy constructor.
    for (var i = 0; i < 50; i++) {
            var randRow = Math.floor(Math.random()*3 + 1);
            allEnemies.push(new Enemy(randRow,(i+1) * -150));
    }
}

// Remove enemies that have finished passing through the screen to keep the array's size manageable
function removeEnemies() {
    for (var i = 0; i < allEnemies.length; i++) {
        if (allEnemies[i].x > 1000) {
            allEnemies.splice(i,1);
        }
    }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        78: 'n',
        81: 'q',
        89: 'y'
    };


    player.handleInput(allowedKeys[e.keyCode]);
});

// Initialize an array to hold enemies
var allEnemies = [];

// Initialize objects
var game = new Game();
var player = new Player();

