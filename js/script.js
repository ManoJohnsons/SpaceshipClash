let config = {
    type:Phaser.AUTO,
    width: 288,
    height: 512,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y:600},
            debug: false,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};
let isGameOver = false;
let isRefresh = false;
let hitPlayed = false;
let diePlayed = false;
let gameStart = false;
let score = 0;
let speed = -150;
let spawnTime = 1500;
let character;
let pipe;
let pipeSprite;
let pipeHeight;
let pipeWidth;
let scoreText;
let game = new Phaser.Game(config);