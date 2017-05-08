BackTogether.Level1_stage3 = function (game) {

};


var platformLayer;
var pausedLayer;
var invincibilityOn = false;
var keys;
var iKeyDown = false;
var playAgain;
var mainMenu;
var next;
var player;
var map;

BackTogether.Level1_stage3.prototype = {

    create: function (game) {
        game.physics.startSystem(Phaser.Physics.P2JS);

        WebFont.load(wfconfig);
        this.stage.backgroundColor = "#3A5963";
        map = this.add.tilemap('level1_stage3', 64, 64);
        map.addTilesetImage('tileset2');
        map.addTilesetImage('tileset3');

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

        // can be Hand, Arm, Torso.
        this.player = new Hand(game);


        // these are general purpose.
        GameScreenConfig.initText(game);
        GameScreenConfig.initHealthBar(game);
        GameScreenConfig.initVolIcon(game);
        this.initKeys();
        this.initRobots();
        // this.initItemBox();

        this.gameItems = [];
        this.gameItems.push('invisible');
        this.gameItems.push('stink');

        keys['SPACE'].onDown.add(this.unpause, this);
        keys['ENTER'].onDown.add(this.unpause, this);

        this.pausedScreen = new PausedScreen(game, this.player);
        this.pausedScreen.off();

        this.popupScreen = new PopupScreen(game, 'Objective: \n ASSASSINATION STYLE ... \n When the robot turns around, \n run against its butt.\n There is a switch to turn it off.');
        this.popupScreen.on();

        // adjust the cordinate. 
        // these lines should be stage unique.
        this.popupScreen.sprite.y = this.camera.view.centerY + game.world.height / 3;
        this.popupScreen.txt.y = this.camera.view.centerY + 260;
        this.popupScreen.okBtn.y = this.camera.view.centerY + 550;
        this.popupScreen.okIcon.y = this.camera.view.centerY + 550;
        game.world.bringToTop(this.popupScreen.okIcon);

    },

    update: function (game) {

        this.player.update();

        if (keys['SPACE'].isDown) {
            this.pausedScreen.on();
        }

        if (keys['O'].isDown) {
            this.game.state.start('WinScreen');
        }

        if (keys['P'].isDown) {
            this.game.state.start('LoseScreen');
        }

        if (keys['TWO'].isDown) {
            Level = 'TWO';
            this.game.state.start('Level2');
        }

        if (keys['I'].isDown && !iKeyDown) {
            iKeyDown = true;
            if (!invincibilityOn) {
                invincibilityOn = true;
                this.toggleOnClick();
            }
            else {
                invincibilityOn = false;
                this.toggleOnClick();
            }
        }
        if (keys['I'].isUp) {
            iKeyDown = false;
        }

        for (var i = 0; i < this.game.robots.length; i++) {

            var r = this.game.robots.children[i];

            if (this.checkOverlap(this.player.sprite, r)) {
                // if the player and a robot overlap, 

                if (!r.vulnerable && this.playerAttackFromLeft(r)) {
                    r.vulnerable = true;
                    this.popupScreen.setText("CONGRATULATIONS! \n You just defeated your first evil robot!");
                    this.popupScreen.on();
                }
                else if (!r.vulnerable && this.playerAttackFromRight(r)) {
                    r.vulnerable = true;
                    this.popupScreen.setText("CONGRATULATIONS! \n You just defeated your first evil robot!");
                    this.popupScreen.on();
                }

                if (!r.vulnerable && !invincibilityOn) {
                    this.screenShake();
                    this.playerDamaged();
                }

            }
        }

        // this.playerVictory();
        Robot.updateRobots(game);

        // this.collectItem(this.itemBox, game);
    },
    playerAttackFromLeft: function (r) {
        console.log(r.body);
        return this.player.sprite.body.x < r.x && this.player.sprite.body.velocity.x >= 0 && r.body.velocity.x >= 0;
    },
    playerAttackFromRight: function (r) {
        return this.player.sprite.body.x > r.x && this.player.sprite.body.velocity.x <= 0 && r.body.velocity.x <= 0;
    },

    collectItem: function (itemBox, game) {
        if (this.checkOverlap(this.player.sprite, itemBox)) {
            if (!itemBox.taken) {
                itemBox.taken = true;
                itemBox.visible = false;

                //player.items will change to gameItems whenever we create more than 2 items
                var randomItem = Math.floor((Math.random() * Object.keys(this.player.items).length));
                var item = this.gameItems[randomItem];

                this.player.items[item]++;

                // rest of the code in this collectItem should only be for level 1 after player got his/her very first game item ever
                this.popupScreen.setText("CONGRATULATIONS! \n You just received your first game item! \n After clicking OK, Press spacebar\n to view inventory.");
                this.popupScreen.on();
            }
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

    playerDamaged: function () {
        crash.play();  // sound effect 
        this.player.damagedTime = this.time.now + 3000;

        this.healthPoint -= 1;
        if (this.healthPoint == 0) {
            this.game.state.start('LoseScreen');
        } else if (this.healthPoint < 2) {
            this.heart.animations.play("quick");
        } else if (this.healthPoint < 4) {
            this.heart.animations.play("normal");
        } else {
            this.heart.animations.play("slow");
        }

        this.healthbar.scale.setTo(1, this.healthPoint);
        this.player.damaged = true;

    },

    initItemBox: function () {
        var itemBoxPos = Tile.findObjectsByType('itemBox', map, 'objectsLayer')[0];
        this.itemBox = this.add.sprite(itemBoxPos.x, itemBoxPos.y, 'itemBox');
        this.itemBox.taken = false;
        this.itemBox.animations.add('normal', [0, 1, 2, 3], 10, true);
        this.itemBox.animations.play('normal');
    },


    initRobots: function () {
        this.game.robots = this.add.group();

        _robot1Start = Tile.findObjectsByType('robot1Start', map, 'objectsLayer')

        console.log(216);
        this.robot1 = Robot.factoryRobot(this.game, _robot1Start[0].x, _robot1Start[0].y);

    },

    // playerVictory: function () {
    //     if (playerEndPos[0].x - 5 < player.body.x && playerEndPos[0].x + 5 > player.body.x) {
    //         console.log("victory!");
    //     }
    // },


    initKeys: function () {
        var inputs = [
            Phaser.Keyboard.ONE,
            Phaser.Keyboard.TWO,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR,
            Phaser.Keyboard.ENTER,
            Phaser.Keyboard.W,
            Phaser.Keyboard.A,
            Phaser.Keyboard.S,
            Phaser.Keyboard.D,
            Phaser.Keyboard.O,
            Phaser.Keyboard.P,
            Phaser.Keyboard.I
        ];
        var name = [
            'ONE', 'TWO', 'UP', 'LEFT', 'RIGHT', 'DOWN', 'SPACE', 'ENTER', 'W', 'A', 'S', 'D', 'O', 'P', 'I'
        ]

        keys = {};
        var keyboard = this.input.keyboard;
        inputs.forEach(function (input, i) {
            keys[name[i]] = keyboard.addKey(input);
        });
    },
    unpause: function (key) {
        // Only act if paused
        if (key.game.paused) {
            console.log(key);
            console.log()
            if (this.popupScreen.popupBool) {
                console.log(551);
                this.popupScreen.off();

            } else if (this.pausedScreen.confirmBool) {

                this.pausedScreen.confirmOff();
                console.log(565);

            } else if (this.pausedScreen.pauseBool) {

                console.log(573);
                this.pausedScreen.off();

            }
        }
    },


}
