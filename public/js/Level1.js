BackTogether.Level1 = function (game) {

};


var platformLayer;
var pausedLayer;

var keys;


BackTogether.Level1.prototype = {

    create: function (game) {

        game.physics.startSystem(Phaser.Physics.P2JS);

        WebFont.load(wfconfig);
        this.stage.backgroundColor = "#3A5963";

        platformLayer = map.createLayer('platformLayer');
        platformLayer.resizeWorld();
        map.setCollisionBetween(1, 8);
        // setCollisionBetween takes two indexes, starting and ending position.
        // BlackTile is at 1st position, RedTile is at 2nd position,
        // (1,1) makes only BlackTile collidable.

        this.score = 0;

        this.physics.p2.convertTilemap(map, platformLayer);

        this.physics.p2.restitution = 0;
        this.physics.p2.gravity.y = 300;

        this.initPlayer();
        this.initItems();
        this.initText();
        this.initEnemies();

        var inputs = [
            Phaser.Keyboard.UP,
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR,
            Phaser.Keyboard.W,
            Phaser.Keyboard.A,
            Phaser.Keyboard.S,
            Phaser.Keyboard.D
        ];
        var name = [
            'UP', 'LEFT', 'RIGHT', 'DOWN', 'SPACE', 'W', 'A', 'S', 'D'
        ]

        keys = {};
        inputs.forEach(function (input, i) {
            keys[name[i]] = game.input.keyboard.addKey(input);
        });

        keys['SPACE'].onDown.add(unpause, self);

        function unpause(event) {
            // Only act if paused
            if (game.paused) {
                pausedLayer.destroy();
                cancelBtn.destroy();
                pausedBtnCard.destroy();
                pausedBtnCardText.destroy();
                resetBtn.destroy();
                resetIcon.destroy();
                settingBtn.destroy();
                settingIcon.destroy();
                inventoryBtn.destroy();
                inventoryTxt.destroy();
                // Unpause the game
                game.paused = false;
            }
        }

    },

    update: function (game) {


        for (var i = 0; i < this.items.length; i++) {
            this.items.children[i].frame = 0;
        }

        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

        if (this.time.now < this.player.damagedTime) {
            if (this.player.face == 'left') {
                this.player.animations.play('left_damaged')
                this.player.body.velocity.x = 100;
                // this.playerDamaged();
                this.screenShake();
            } else {
                this.player.animations.play("right_damaged")
                this.player.body.velocity.x = -100;
                this.screenShake();
            }

        } else {
            if (keys['LEFT'].isDown || keys['A'].isDown) {
                //  Move to the left
                this.player.body.velocity.x = -150;

                this.player.animations.play('left');
                this.player.face = 'left';
            }
            else if (keys['RIGHT'].isDown || keys['D'].isDown) {
                //  Move to the right
                this.player.body.velocity.x = 150;

                this.player.animations.play('right');
                this.player.face = 'right';
            } else {
                if (this.player.face == 'left') {
                    this.player.animations.play('left');
                } else {
                    this.player.animations.play('right');
                }
            }

        }

        for (var i = 0; i < this.items.length; i++) {
            if (this.items.children[i].held) {
                this.items.children[i].body.y = this.player.body.y;
                this.items.children[i].body.x = this.player.body.x - this.pipe1.offset * (7 / 10);
                this.items.children[i].holdTime += .166;
            }

            else {
                this.items.children[i].releaseTime += .166;
            }

            this.items.children[i].holdbox1 = this.items.children[i].body.x;
            this.items.children[i].holdbox2 = this.items.children[i].body.x + this.items.children[i].body.width;

        }

        for (var i = 0; i < this.items.length; i++) {
            if (this.items.children[i].held) {
                this.items.children[i].body.y = this.player.body.y;
                this.items.children[i].body.x = this.player.body.x - this.pipe1.offset * (7 / 10);
                this.items.children[i].holdTime += .166;
            }

            else {
                this.items.children[i].releaseTime += .166;
            }

            this.items.children[i].holdbox1 = this.items.children[i].body.x;
            this.items.children[i].holdbox2 = this.items.children[i].body.x + this.items.children[i].body.width;

        }
        if (keys['SPACE'].isDown) {
            this.initPausedScreen(game);
        }

        this.updateEnemies();

        if (this.checkOverlap(this.player, this.enemies)) {

            this.playerDamaged();
        }

    },

    checkOverlap: function (spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    },
    screenShake: function () {
        this.camera.shake(0.01, 100);
    },

    propUser: function () {
        for (var i = 0; i < this.item.length; i++) {
            if (!this.item.children[i].held) {
                this.item.children[i].frame = 1;
            }
        }
        if (keys['DOWN'].isDown || keys['S'].isDown) {
            if (!this.item.children[i].held && this.item.children[i].releaseTime > 10) {
                this.item.children[i].held = true;
                this.item.children[i].frame = 0;
                this.item.children[i].body.gravity.y = 0;
                this.item.children[i].frame = 0;
                this.item.children[i].releaseTime = 0;
                this.item.children[i].holdTime = 0;
                var dist1 = Math.abs(this.player.body.x - this.item.children[i].holdbox1);
                var dist2 = Math.abs(this.player.body.x - this.item.children[i].holdbox2);

                if (dist2 < dist1) {
                    this.item.children[i].offset = this.item.children[i].body.width;
                }
                else {
                    this.item.children[i].offset = 0;
                }
            }
            else {
                if (this.item.children[i].holdTime > 10) {
                    this.item.children[i].held = false;
                    this.item.children[i].frame = 1;
                    this.item.children[i].body.gravity.y = 300;
                    this.item.children[i].releaseTime = 0;
                    this.item.children[i].holdTime = 0;
                }


            }
        }
    },


    initItems: function () {
        this.items = this.add.group();

        this.items.enableBody = true;

        this.pipe1 = this.items.create(300, 100, 'pipe');

        this.pipe1.body.gravity.y = 300;
        this.pipe1.body.bounce.y = .1;
        this.pipe1.held = false;
        this.pipe1.releaseTime = 0;
        this.pipe1.holdbox1 = this.pipe1.body.x;
        this.pipe1.holdbox2 = this.pipe1.body.x + this.pipe1.body.width;
        this.pipe1.type = "item";
    },
    playerDamaged: function () {
        if (this.player.damagedTime < this.time.now) {

            this.player.damagedTime = this.time.now + 200;
        }

    },
    initPlayer: function () {
        // The player and its settings
        this.player = this.add.sprite(this.world.centerX, this.world.centerY - 150, 'hand');

        //  We need to enable physics on the player
        this.physics.p2.enable(this.player, true);

        this.player.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 5), 10, true);
        this.player.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 5), 10, true);
        this.player.animations.add('left_damaged', Phaser.Animation.generateFrameNames('left_damaged', 1, 2), 10, true);
        this.player.animations.add('right_damaged', Phaser.Animation.generateFrameNames('right_damaged', 1, 2), 10, true);


        this.player.animations.play('left');
        this.player.face = 'left';

        this.player.body.clearShapes();
        this.player.body.addPolygon({}, [[1, 42], [1, 29], [32, 20], [63, 29], [63, 42]]);


        this.camera.follow(this.player);

        this.player.damaged = false;
        this.player.damagedTime = 0;

    },
    initText: function () {
        // the level
        this.levelText = this.add.text(100, 70, 'Level:' + Level, { font: '32px Aclonica', fill: '#000' });

        //  The score
        this.scoreText = this.add.text(100, 100, 'Score: 0', { font: '32px Aclonica', fill: '#000' });
        this.levelText.fixedToCamera = true;
        this.scoreText.fixedToCamera = true;
    },
    initEnemies: function () {

        this.enemies = this.add.group()


        this.enemy1 = this.enemies.create(64 * 1 + 16, -50, 'enemy1');
        this.physics.p2.enable(this.enemy1, true);
        this.enemy1.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 2), 10, true);
        this.enemy1.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 2), 10, true);
        this.enemy1.body.clearShapes();
        this.enemy1.body.addRectangle(86, 256, 5, 11);
        this.enemy1.body.addRectangle(86, 256, 5, 11);
        this.enemy1.body.addRectangle(55, 241, 60, 213, 0);
        this.enemy1.body.addRectangle(55, 241, -30, 203, 0);
        this.enemy1.body.fixedRotation = true;



        this.enemy2 = this.enemies.create(64 * 7 + 16, 0, 'enemy1');
        this.physics.p2.enable(this.enemy2, true);
        this.enemy2.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 2), 10, true);
        this.enemy2.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 2), 10, true);
        this.enemy2.animations.play('right');
        this.enemy2.body.clearShapes();
        this.enemy2.body.addRectangle(86, 256, 5, 11);
        this.enemy2.body.addRectangle(55, 241, 60, 213, 0);
        this.enemy2.body.addRectangle(55, 241, -30, 203, 0);
        this.enemy2.body.fixedRotation = true;

        this.enemy3 = this.enemies.create(64 * 13 + 16, 0, 'enemy1');
        this.physics.p2.enable(this.enemy3, true);
        this.enemy3.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 2), 10, true);
        this.enemy3.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 2), 10, true);
        this.enemy3.animations.play('right');
        this.enemy3.body.clearShapes();
        this.enemy3.body.addRectangle(86, 256, 5, 11);
        this.enemy3.body.addRectangle(55, 241, 60, 213, 0);
        this.enemy3.body.addRectangle(55, 241, -30, 203, 0);
        this.enemy3.body.fixedRotation = true;

    },
    updateEnemies: function () {

        if (this.enemy1.body.x < 64 * 1 + 2) {
            this.enemy1.animations.play('right')
            this.enemy1.body.velocity.x = 100;
        } else if (this.enemy1.body.x > 64 * 3 + 32 - 2) {
            this.enemy1.animations.play('left');
            this.enemy1.body.velocity.x = -100;
        }

        if (this.enemy2.body.x < 64 * 7 + 2) {
            this.enemy2.animations.play('right');
            this.enemy2.body.velocity.x = 100;
        } else if (this.enemy2.body.x > 64 * 8 + 32 - 2) {
            this.enemy2.animations.play('left');
            this.enemy2.body.velocity.x = -100;
        }

        if (this.enemy3.body.x < 64 * 13 + 2) {
            this.enemy3.animations.play('right');
            this.enemy3.body.velocity.x = 100;
        } else if (this.enemy3.body.x > 64 * 16 + 32 - 2) {
            this.enemy3.animations.play('left');
            this.enemy3.body.velocity.x = -100;
        }
    },
    initPausedScreen: function (game) {
        pausedLayer = map.createLayer('pausedLayer');
        pausedLayer.resizeWorld();
        pausedLayer.alpha = 0.6;
        game.paused = true;

        pausedBtnCard = this.add.sprite(this.camera.view.centerX, this.camera.view.centerY, 'pausedBtnCard')
        pausedBtnCard.anchor.setTo(0.5, 0.5);
        pausedBtnCard.scale.setTo(2.5, 2.5);

        cancelBtn = this.add.button(this.camera.view.centerX + 235, this.camera.view.centerY - 110, 'cancelIcon', this.resumeOnClick, this, 2, 1, 0);
        cancelBtn.anchor.setTo(0.5, 0.5);
        cancelBtn.scale.setTo(0.3, 0.3);

        pausedBtnCardText = this.add.text(this.camera.view.centerX, this.camera.view.centerY + 260, 'Press Spacebar to resume', { font: '32px Aclonica', fill: '#FFF' });
        pausedBtnCardText.anchor.setTo(0.5, 0.5);

        settingBtn = this.add.button(this.camera.view.centerX - 134, this.camera.view.centerY + 55, 'pausedBtn', this.settingOnClick, this, 2, 1, 0);
        settingBtn.anchor.setTo(0.5, 0.5);
        settingBtn.scale.setTo(1.6, 1.6);

        settingIcon = this.add.sprite(this.camera.view.centerX - 134, this.camera.view.centerY + 55, 'settingIcon');
        settingIcon.anchor.setTo(0.5, 0.5);
        settingIcon.scale.setTo(0.8, 0.8);


        resetBtn = this.add.button(this.camera.view.centerX - 134, this.camera.view.centerY - 55, 'pausedBtn', this.resetOnClick, this, 2, 1, 0);
        resetBtn.anchor.setTo(0.5, 0.5);
        resetBtn.scale.setTo(1.6, 1.6);

        resetIcon = this.add.sprite(this.camera.view.centerX - 134, this.camera.view.centerY - 55, 'resetIcon');
        resetIcon.anchor.setTo(0.5, 0.5);
        resetIcon.scale.setTo(0.8, 0.8);


        inventoryBtn = this.add.image(this.camera.view.centerX + 79, this.camera.view.centerY, 'pausedBtn');
        inventoryBtn.anchor.setTo(0.5, 0.5);
        inventoryBtn.scale.setTo(3.8, 3.8);

        inventoryTxt = this.add.text(this.camera.view.centerX + 79, this.camera.view.centerY, 'inventory', { font: '32px Aclonica', fill: '#000' });
        inventoryTxt.anchor.setTo(0.5, 0.5);
    },
    resetOnClick: function (game) {
        this.score = 0;
        this.state.restart();
        game.paused = false;
    },
    settingOnClick: function () {
        console.log('setting button clicked');
    },
    resumeOnClick: function (game) {
        pausedLayer.destroy();
        cancelBtn.destroy();
        pausedBtnCard.destroy();
        pausedBtnCardText.destroy();
        resetBtn.destroy();
        resetIcon.destroy();
        settingBtn.destroy();
        settingIcon.destroy();
        inventoryBtn.destroy();
        inventoryTxt.destroy();
        // Unpause the game
        game.paused = false;
    }
}
