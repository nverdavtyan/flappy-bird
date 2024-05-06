const config = {
    type: Phaser.AUTO,
    width: 350,
    height: 550,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    }
};

let game = new Phaser.Game(config);
let bird, pipes, score = 0, started = false;
let scoreText;
let gameOverText, restartButton;
let startButton;

function preload() {
    this.load.image('background', './images/bg.png');
    this.load.image('bird-0', './images/bird-0.png');
    this.load.image('bird-1', './images/bird-1.png');
    this.load.image('bird-2', './images/bird-2.png');
    
    this.load.image('pipe', './images/pipe.png');
    this.load.image('bottompipe', './images/bottompipe.png');
    
}

function create() {
    let bg = this.add.image(0, 0, 'background');
    bg.setOrigin(0, 0);
    bg.displayWidth = this.sys.canvas.width;
    bg.displayHeight = this.sys.canvas.height;

    this.anims.create({
        key: 'flap',
        frames: [
            { key: 'bird-0' },
            { key: 'bird-1' },
            { key: 'bird-2' }
        ],
        frameRate: 10,
        repeat: -1
    });

    bird = this.physics.add.sprite(50, 150, 'bird-0');
    bird.anims.play('flap', true);

    bird.body.allowGravity = false;

    pipes = this.physics.add.group();


    startButton = this.add.text(175, 275, 'Start', { fontSize: '32px', fill: '#fff' });
    startButton.setOrigin(0.5);
    startButton.setInteractive();

    startButton.on('pointerdown', () => {
        startButton.destroy(); 
        startGame.call(this);
    });

    scoreText = this.add.text(175, 40, '0', { fontSize: '42px', fill: '#fff' });
    scoreText.setOrigin(0.5); 

    this.physics.add.collider(bird, pipes, endGame, null, this);
}

function startGame() {
    bird.body.allowGravity = true;
    started = true;

    this.time.addEvent({ delay: 2000, callback: addPipes, callbackScope: this, loop: true });

    this.input.on('pointerdown', () => {
        bird.setVelocityY(-200);
    });
}


function update() {
    if (!started) return;

    if (bird.body.velocity.y > 0) {
        bird.body.gravity.y = 600;  
    } else {
        bird.body.gravity.y = 300;  
    }

    pipes.getChildren().forEach((pipe) => {
        if (pipe.x < -50) {
            pipe.destroy();
            if (pipe.isUpper) { 
                score++;
                scoreText.setText(score);
            }
        }
    });

    if (bird.y > this.sys.game.config.height) {
        endGame.call(this);
    }
}



function addPipes() {
    const holeHeight =520; 
    const gameHeight = this.sys.game.config.height;
    console.log(gameHeight)

    
    const randomHolePosition = Math.floor(Math.random() * (200 - (-50) + 1)) + (-50);


    console.log(randomHolePosition)


    const upperPipeY = randomHolePosition;  
    const lowerPipeY = randomHolePosition + holeHeight; 


    let upperPipe = pipes.create(400, upperPipeY, 'bottompipe');
    let lowerPipe = pipes.create(400, lowerPipeY, 'bottompipe');
    upperPipe.setDisplaySize(50, 400);
    lowerPipe.setDisplaySize(50, 400);  
    upperPipe.isUpper = true

    upperPipe.setFlipY(true);

    upperPipe.setVelocityX(-100);
    lowerPipe.setVelocityX(-100);


    upperPipe.body.allowGravity = false;
    lowerPipe.body.allowGravity = false;
}



function endGame() {
    this.physics.pause();
    bird.setTint(0xff0000);
    started = false;
    scoreText.setText(score);

    gameOverText = this.add.text(175, 275, 'Game Over', { fontSize: '32px', fill: '#fff' });
    gameOverText.setOrigin(0.5);

    restartButton = this.add.text(175, 325, 'Restart', { fontSize: '24px', fill: '#fff' });
    restartButton.setOrigin(0.5);
    restartButton.setInteractive();
    restartButton.on('pointerdown', () => { location.reload(); });  
}