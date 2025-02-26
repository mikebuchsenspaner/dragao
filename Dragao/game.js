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
        this.load.image('fire', 'assets/turbo.png'); // Carregando a imagem do fogo
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

        // Criando um grupo para os fogos
        this.fires = this.physics.add.group();
    }

    update() {
        if (this.cursors.space.isDown || this.cursors.up.isDown) {
            this.player.setVelocityY(-200);
            this.shootFire(); // Disparar fogo ao pressionar espaço
        }

        if (this.cursors.right.isDown) {
            this.player.setVelocityX(100);
        } else if (this.cursors.left.isDown) {
            this.player.setVelocityX(-100);
        } else {
            this.player.setVelocityX(0);
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

    shootFire() {
        // Criar um fogo saindo do dragão
        let fire = this.fires.create(this.player.x + 60, this.player.y, 'fire');
        fire.setScale(0.5);
        fire.setVelocityX(200); // Velocidade do fogo para frente

        // Remover fogo após certo tempo
        this.time.delayedCall(800, () => {
            fire.destroy();
        });
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
