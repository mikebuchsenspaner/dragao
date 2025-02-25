class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image('playButton', 'assets/play_bt.png'); // Botão de jogar
    }

    create() {
        this.add.text(100, 100, 'Bem-vindo ao Jogo!', { fontSize: '24px', fill: '#fff' });
        
        let playButton = this.add.image(200, 300, 'playButton').setInteractive();
        playButton.setScale(0.5);

        playButton.on('pointerdown', () => {
            this.scene.start('GameScene'); // Transição para a cena principal do jogo
        });
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('bg', 'assets/fundo.png');
        this.load.spritesheet('dragon', 'assets/dragao.png', { frameWidth: 170, frameHeight: 133 });
        this.load.image('col_bottom', 'assets/coluna_bottom.png');
        this.load.image('col_upper', 'assets/coluna_upper.png');
        this.load.image('game_over', 'assets/gameover.png');
    }

    create() {
        this.add.image(200, 300, 'bg');
        this.player = this.physics.add.sprite(100, 300, 'dragon').setScale(.8);
        this.player.body.setSize(50, 80, true);
        this.player.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, 400, 600);

        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('dragon', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        this.player.anims.play('fly');

        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.columns = this.physics.add.group();
        this.time.addEvent({ delay: 1500, callback: this.spawnColumns, callbackScope: this, loop: true });

        this.physics.add.collider(this.player, this.columns, this.gameOver, null, this);
    }

    update() {
        if (this.cursors.space.isDown || this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
        }
    }

    spawnColumns() {
        let colY = Phaser.Math.Between(200, 400);
        let col1 = this.columns.create(400, colY - 150, 'col_upper').setOrigin(0, 1);
        let col2 = this.columns.create(400, colY + 150, 'col_bottom').setOrigin(0, 0);
        
        this.physics.add.existing(col1);
        this.physics.add.existing(col2);
        
        col1.body.setVelocityX(-100);
        col2.body.setVelocityX(-100);
        
        col1.body.allowGravity = false;
        col2.body.allowGravity = false;
    }

    gameOver() {
        this.scene.restart();
    }
}

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#39addd',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [StartScene, GameScene]
};

const game = new Phaser.Game(config);