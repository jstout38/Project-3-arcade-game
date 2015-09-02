
    exitPosition = Math.floor(Math.random() * 5);

var Game = function() {
    this.gameHasStarted = false;
    this.score = 0;
    this.lives = 5;
    this.characters = ['images/char-boy.png', 'images/char-cat-girl.png', 'images/char-horn-girl.png', 'images/char-pink-girl.png', 'images/char-princess-girl.png'];
    this.resetGame = false;
    this.gameOver = false;
    this.cursorPosition = 2;
};

Game.prototype.renderCursor = function() {
    ctx.drawImage(Resources.get("images/Selector.png"), game.cursorPosition * 101, 405);
};

// Enemies our player must avoid
var Enemy = function(row, start) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = start;
    this.y = row * 83 - 20;
    this.speed = Math.random() + .5;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + dt * 150 * this.speed;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];

function addEnemies() {
    for (i = 0; i < 50; i++) {
            randRow = Math.floor(Math.random()*3 + 1);
            allEnemies.push(new Enemy(randRow,i * -150));
    };
}

function removeEnemies() {
    for (i = 0; i < allEnemies.length; i++) {
        if (allEnemies[i].x > 1000) {
            allEnemies.splice(i,1);
        };
    }
}

var Heart = function() {
    this.sprite = "images/Heart.png";
    this.x = Math.floor(Math.random()*5) * 101;
    this.y = (Math.floor(Math.random()*3) + 1) * 83;
    this.show = true;
    if (Math.random() < .8) {
        this.show = false;
    }
};

Heart.prototype.render = function() {
    if (heart.show) {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

Heart.prototype.heartCollisionCheck = function() {
    if (heart.show) {
        if (!(player.x > this.x + 85 || player.x +101 < this.x + 16 ||
                 player.y + 73 > this.y + 140 || player.y +143 < this.y + 60)) {
            return true;
        };
    }
    return false;
};

var Player = function() {
    this.sprite = game.characters[game.cursorPosition];
    this.x = 202;
    this.y = 405;
};

Player.prototype.update = function() {
    if (this.y === -10) {
        player = new Player();
        game.score++;
        exitPosition = Math.floor(Math.random() * 5);
        heart = new Heart;
    };
    if (this.collisionCheck()) {
        player = new Player();
        game.lives--;
        if (game.lives < 1) {
            game.gameOver = true;
            game.lives = 5;
        }
    };
    if (heart.heartCollisionCheck()) {
        heart.show = false;
        game.lives++;
    }
};

Player.prototype.collisionCheck = function() {
    for (i = 0; i < allEnemies.length; i++) {
        if (!(allEnemies[i].x > this.x + 85 || allEnemies[i].x +101 < this.x + 16 ||
                 allEnemies[i].y + 73 > this.y + 140 || allEnemies[i].y +143 < this.y + 60)) {
            return true;
        };
    };
    return false;
};

Player.prototype.handleInput = function(keyCode) {
    if (game.gameHasStarted) {
        if (keyCode === 'left' && this.x > 0) {
            this.x = this.x - 101;
        }
        else if (keyCode === 'up' && this.y > 0) {
            if (this.y > 83 || this.x  === exitPosition * 101) {
                this.y = this.y - 83;
            }
        }
        else if (keyCode === 'right' && this.x < 404) {
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
        if (keyCode === 'left' && game.cursorPosition > 0) {
            game.cursorPosition--;
        }
        else if (keyCode== 'right' && game.cursorPosition < 4) {
            game.cursorPosition++;
        }
        else if (keyCode === 'enter') {
            game.gameHasStarted = true;
            player = new Player;
        };
    }
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        13: 'enter',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        81: 'q'
    };


    player.handleInput(allowedKeys[e.keyCode]);
});

var game = new Game;
var player = new Player;
var heart = new Heart;

