let config = {
  type: Phaser.AUTO,
  width: 288,
  height: 512,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 600 },
      debug: true,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let isGameOver = false;
let score = 0;
let scoreText;
let isRefresh = false;
let hitPlayed = false;
let diePlayed = false;
let character;
let playerSpeed = 210;
let background;
let base;
let baseImage;
let baseHeight;
let baseWidth;
let speed = -150;
let spawnTime = 1500;
let timer;
let gameStart = false;

let game = new Phaser.Game(config);

function preload() {
  this.load.image("background", "assets/sprites/background.png");
  this.load.image("spaceship1", "assets/sprites/nave/tile000.png");
  this.load.image("spaceship2", "assets/sprites/nave/tile001.png");
  this.load.image("spaceship3", "assets/sprites/nave/tile002.png");
  this.load.image("spaceship4", "assets/sprites/nave/tile003.png");
  this.load.image("spaceship5", "assets/sprites/nave/tile004.png");
  this.load.image("spaceship6", "assets/sprites/nave/tile005.png");
  this.load.image("spaceship7", "assets/sprites/nave/tile006.png");
  this.load.image("spaceship8", "assets/sprites/nave/tile007.png");
  this.load.image("spaceship9", "assets/sprites/nave/tile008.png");
  this.load.image("spaceship010", "assets/sprites/nave/tile009.png");
  this.load.image("spaceship011", "assets/sprites/nave/tile010.png");
  this.load.image("explosion1", "assets/sprites/explosion/explosion-e1.png");
  this.load.image("explosion2", "assets/sprites/explosion/explosion-e2.png");
  this.load.image("explosion3", "assets/sprites/explosion/explosion-e3.png");
  this.load.image("explosion4", "assets/sprites/explosion/explosion-e4.png");
  this.load.image("explosion5", "assets/sprites/explosion/explosion-e5.png");
  this.load.image("explosion6", "assets/sprites/explosion/explosion-e6.png");
  this.load.image("explosion7", "assets/sprites/explosion/explosion-e7.png");
  this.load.image("explosion8", "assets/sprites/explosion/explosion-e8.png");
  this.load.image("explosion9", "assets/sprites/explosion/explosion-e9.png");
  this.load.image("explosion010", "assets/sprites/explosion/explosion-e10.png");
  this.load.image("explosion011", "assets/sprites/explosion/explosion-e11png");
  this.load.image("explosion012", "assets/sprites/explosion/explosion-e12.png");
  this.load.image("explosion013", "assets/sprites/explosion/explosion-e13.png");
  this.load.image("explosion014", "assets/sprites/explosion/explosion-e14.png");
  this.load.image("explosion015", "assets/sprites/explosion/explosion-e15.png");
  this.load.image("explosion016", "assets/sprites/explosion/explosion-e16.png");
  this.load.image("explosion017", "assets/sprites/explosion/explosion-e17.png");
  this.load.image("explosion018", "assets/sprites/explosion/explosion-e18.png");
  this.load.image("explosion019", "assets/sprites/explosion/explosion-e19.png");
  this.load.image("explosion020", "assets/sprites/explosion/explosion-e20.png");
  this.load.image("explosion021", "assets/sprites/explosion/explosion-e21.png");
  this.load.image("explosion022", "assets/sprites/explosion/explosion-e22.png");
  this.load.image("pillar", "assets/sprites/pipe-green.png");
  this.load.image("base", "assets/sprites/base.png");
  this.load.image("gameover", "assets/UI/gameover.png");
  this.load.image("score", "assets/UI/score.png");
  this.load.image("retry", "assets/UI/retry.png");
  this.load.image("startGame", "assets/UI/message.png");
  this.load.image('cursor', 'assets/sprites/drawcursor.png');
  this.load.audio("spaceshipSound", "assets/sfx/engine_run.mp3");
  this.load.audio("simplePoint", "assets/sfx/positive.ogg");
  this.load.audio("specialPoint", "assets/sfx/achievement.wav");
  this.load.audio("music2", "assets/music/music2.mp3");
  this.load.audio("music3", "assets/music/interlude.wav");
}

function create() {
  background = this.add.tileSprite(0, 0, 512, 0, "background");
  background.setOrigin(0, 0.2);
  background.displayWidth = this.sys.game.config.width;
  background.displayheight = this.sys.game.config.height;
  let baseImage = this.textures.get("base");
  let baseHeight = baseImage.getSourceImage().height;
  let baseWidth = baseImage.getSourceImage().width;
  base = this.add.tileSprite(game.config.width / 2, game.config.height - baseHeight / 2, baseWidth, baseHeight, "base");
  this.physics.add.existing(base, true);
  base.setDepth(1);
  let startGameImage = this.add.image(game.config.width / 2, game.config.height / 3, "startGame");
  startGameImage.setOrigin(0.5, 0.5);
  character = this.physics.add.sprite(game.config.width / 4, game.config.height / 2, "spaceship1");
  character.setDepth(1);
  character.setCollideWorldBounds(true);
  character.body.allowGravity = false;

  backgroundMusic2 = this.sound.add("music2", { loop: true });
  backgroundMusic2.play();

  gameStart = false;

  this.anims.create({
    key: "fly",
    frames:[
      {key:"spaceship1"},
      {key:"spaceship2"},
      {key:"spaceship3"},
      {key:"spaceship4"},
      {key:"spaceship5"},
      {key:"spaceship6"},
      {key:"spaceship7"},
      {key:"spaceship8"},
      {key:"spaceship9"},
      {key:"spaceship010"},
      {key:"spaceship011"},
    ],
    frameRate:16,
    repeat:-1,
  });
  this.anims.create({
    key: "explosion",
    frames:[
      {key:"explosion1"},
      {key:"explosion2"},
      {key:"explosion3"},
      {key:"explosion4"},
      {key:"explosion5"},
      {key:"explosion6"},
      {key:"explosion7"},
      {key:"explosion8"},
      {key:"explosion9"},
      {key:"explosion010"},
      {key:"explosion011"},
      {key:"explosion012"},
      {key:"explosion013"},
      {key:"explosion014"},
      {key:"explosion015"},
      {key:"explosion016"},
      {key:"explosion017"},
      {key:"explosion018"},
      {key:"explosion019"},
      {key:"explosion020"},
      {key:"explosion021"},
      {key:"explosion022"},
    ],
    frameRate:26,
  });
  character.setDisplaySize(100 ,100);
  character.setSize(200, 200);
  character.setFlip(true);
  character.anims.play("fly", true);

  this.input.on("pointerdown", function (pointer) {
    if (gameStart) return;

    //sons aqui embaixo
    interlude = this.sound.add("music3", { loop: true });
    simplePoint = this.sound.add("simplePoint");
    specialPoint = this.sound.add("specialPoint");
    //engine = this.sound.add("spaceshipSound", { loop: true });

    gameStart = true;
    startGameImage.setVisible(false);
    character.body.allowGravity = true;
    this.upperPillars = this.physics.add.group();
    this.lowerPillars = this.physics.add.group();
    this.spawnPillarPair();
    this.physics.add.collider(character, this.upperPillars, hitPillar, null, this);
    this.physics.add.collider(character, this.lowerPillars, hitPillar, null, this);
    this.physics.add.collider(character, base, hitBase, null, this);

    scoreText = this.add.text(game.config.width / 2, 30, "0", {
      fontSize: "32px",
      fontFamily: "Fantasy",
      fill: "white",
    });
    scoreText.setOrigin(0.5, 0.5);
    scoreText.setDepth(1);

    var cursor = this.add.image(0, 0, 'cursor').setVisible(false);
    this.input.on('pointermove', function (pointer) {
      cursor.setPosition(pointer.x - 30, pointer.y);
      if (!isGameOver) {
        this.physics.moveToObject(character, cursor, playerSpeed, 350);
        updateAngle(this.game, character, this.input.activePointer);
      }
    }, this);
  }, this);
}

function update() {
  if (!isGameOver) {
    base.tilePositionX += 1;
    background.tilePositionX += 1;
  }
  if (!gameStart) return;

  let scoreIncremented = false;
  [this.upperPillars, this.lowerPillars].forEach((group) => {
    group.children.iterate((pillar) => {
      if (!pillar) return;

      if (!pillar.hasPassed && pillar.x + pillar.width < character.x) {
        pillar.hasPassed = true;
        if (!scoreIncremented) {
          score++;
          scoreText.setText(score);
          score % 5 == 0 ? specialPoint.play() : simplePoint.play();
          scoreIncremented = true;
        }
      }
      if (pillar.x + pillar.width < 0) {
        pillar.destroy();
      }
    });
  });
  scoreIncremented = false;
  if (this.pillarSpawnTime < this.time.now && !isGameOver) {
    this.spawnPillarPair();
  }
}

Phaser.Scene.prototype.spawnPillarPair = function () {
  baseImage = this.textures.get("base");
  baseHeight = baseImage.getSourceImage().height;
  let pillarImage = this.textures.get("pillar");
  let pillarHeight = pillarImage.getSourceImage().height;
  let Offset = (Math.random() * pillarHeight) / 2;
  let k = Math.floor(Math.random() * 3) - 1;
  Offset = Offset * k;
  let gapHeight = (1 / 3) * (game.config.height - baseHeight);
  let lowerY = 2 * gapHeight + pillarHeight / 2 + Offset;
  let upperY = gapHeight - pillarHeight / 2 + Offset;
  let upperPillar = this.upperPillars.create(game.config.width, upperY, "pillar");
  upperPillar.setAngle(180);
  let lowerPillar = this.lowerPillars.create(game.config.width, lowerY, "pillar");
  upperPillar.body.allowGravity = false;
  lowerPillar.body.allowGravity = false;

  upperPillar.setVelocityX(speed);
  lowerPillar.setVelocityX(speed);
  this.pillarSpawnTime = this.time.now + spawnTime;
}

function hitBase(character, base) {
  character.anims.play("explosion", true);
  backgroundMusic2.stop();
  interlude.play();
  base.body.enable = false;
  character.setVelocityX(0);
  character.setVelocityY(0);
  character.setDepth(0);
  character.body.allowGravity = false;
  [this.upperPillars, this.lowerPillars].forEach(group => group.children.iterate(pillar => pillar.body.velocity.x = 0));
  isGameOver = true;
  let gameOverImage = this.add.image(game.config.width / 2, game.config.height / 4, "gameover");
  gameOverImage.setOrigin(0.5, 0.5);
  let scoreImage = this.add.image(game.config.width / 2, game.config.height, "score");
  scoreImage.setOrigin(0.5, 0.5);
  finalScoreText = this.add.text(game.config.width / 2, game.config.height, score, { fontSize: "32px", fontFamily: "Fantasy", fill: "white" });
  finalScoreText.setOrigin(0.5, 0.5);
  this.tweens.add({
    targets: [scoreImage, finalScoreText],
    y: function (target) {
      return target === scoreImage ? game.config.height / 2.2 : game.config.height / 2.1;
    },
    ease: "Power1",
    duration: 500,
    repeat: 0,
    yoyo: false,
  });
  scoreText.destroy();
  let retryImage = this.add.image(game.config.width / 2, game.config.height / 1.5, "retry");
  retryImage.setOrigin(0.5, 0.5);
  retryImage.setScale(0.25);
  retryImage.setInteractive();
  retryImage.on("pointerdown", function (pointer) {
    isGameOver = false;
    score = 0;
    gameStart = false;
    interlude.stop();
    //this.sound.remove(engine);
    this.scene.restart();
    isRefresh = true;
  }, this);
}

function hitPillar(character, pillar) {
  character.anims.play("explosion", true);
  backgroundMusic2.stop();
  pillar.body.enable = false;
  character.setVelocityX(0);
  [this.upperPillars, this.lowerPillars].forEach(group => group.children.iterate(pillar => pillar.body.velocity.x = 0));
  isGameOver = true;
}

function updateAngle(game, sprite, pointer) {
  const dx = game.input.activePointer.x - sprite.x;
  const dy = game.input.activePointer.y - sprite.y;
  const targetAngle = (360 / (2 * Math.PI)) * Math.atan2(dy, dx);

  if (Phaser.Math.Fuzzy.Equal(targetAngle, 0, 0.02 * (360 / (2 * Math.PI)))) {
    sprite.rotation = Phaser.Math.Angle.Between(sprite.x, sprite.y, pointer.worldX, pointer.worldY);
    sprite.setAngularVelocity(0);
  } else {
    sprite.angle = targetAngle;
  }
}
