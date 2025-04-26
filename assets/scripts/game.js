var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var bananas;
var platforms;
var score = 0;
var scoreText;
var win;

var game = new Phaser.Game(config);

function preload ()
{
        this.load.image('sky', "assets/imgs/sky.jpg");
        this.load.image('ground', 'assets/imgs/platform.png');
        this.load.image('banana', 'assets/imgs/banana.png');
        this.load.spritesheet('dude', "assets/imgs/dude.png", { frameWidth: 32, frameHeight: 48 });
}

function create ()
{
    this.add.image(0, 0, 'sky').setOrigin(0, 0);

    platforms = this.physics.add.staticGroup();

        platforms.create(650, 730, 'ground').setScale(4).refreshBody(); //floor

        platforms.create(450, 430, 'ground'); //transition floor to left
        platforms.create(50, 250, 'ground'); //left most
        platforms.create(1120, 180, 'ground'); //right  most
        platforms.create(800, 570, 'ground'); //second floor
        platforms.create(820, 290, 'ground'); //transition floor to left

        player = this.physics.add.sprite(100, 450, 'dude');

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.physics.add.collider(player, platforms);

        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        bananas = this.physics.add.group({
            key: 'banana',
            repeat: 11,
            setXY: { x: 15, y: 0, stepX: 110 }
        });

        bananas.children.iterate(function (child) {

            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            child.setScale(0.01);

        });

        this.physics.add.collider(bananas, platforms);

        this.physics.add.overlap(player, bananas, collectBanana, null, this);

        scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

        winText = this.add.text(640, 360, '', {
            fontSize: '64px',
            fill: '#fff'
        }).setOrigin(0.5);
}

function update ()
{
    if (this.keys.left.isDown)
        {
            player.setVelocityX(-160);
            player.anims.play('left', true);
        }
        else if (this.keys.right.isDown)
        {
            player.setVelocityX(160);
            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);
            player.anims.play('turn');
        }
        
        if (this.keys.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-330);
        }        
}

function collectBanana (player, banana)
    {
        banana.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (score >= 300) {
            winText.setText('You Win!');
            this.physics.pause();            
            player.setTint(0x00ff00);      
            player.anims.play('turn');
            console.log("You won the most scuffed game ever!");
        }

    if (bananas.countActive(true) === 0)
        {
            bananas.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
            });
        }
    }