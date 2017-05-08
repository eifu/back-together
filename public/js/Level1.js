BackTogether.Level1 = function (game) {

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
var playerStartPos;
var playerEndPos;
var map;

var gameItems;
var popup = false;      // 'pupup', 'confirm', 'pause' are used in unpause function. these have to be global variables.
var confirm = false;
var pause = false;
var popupScreen;        // 'popupScreen' is used the objectiveCard, popupCard, confirmCard.
var confirmCard;        // 'confirmCard' is used in pausedCard, inventory event.

BackTogether.Level1.prototype = {

    create: function (game) {
        game.physics.startSystem(Phaser.Physics.P2JS);

        WebFont.load(wfconfig);
        this.stage.backgroundColor = "#3A5963";
        map = this.add.tilemap('lvl1', 64, 64);
        map.addTilesetImage('tileset2');

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

        this.player = new Hand(game);
        // this.initItems();
        this.initText();
        this.initHealthBar();
        this.initRobots();
        this.initItemBox();
        this.initVolIcon();
        this.initKeys();


        gameItems = [];
        gameItems.push('invisible');
        gameItems.push('stink');

        keys['SPACE'].onDown.add(this.unpause, this);
        keys['ENTER'].onDown.add(this.unpause, this);

        this.pausedScreen = new PausedScreen(game, this.player);
        this.pausedScreen.off();

        this.popupScreen = new PopupScreen(game, 'Objective: \n ASSASSINATION STYLE ... \n When the robot turns around, \n run against its butt.\n There is a switch to turn it off.');
        this.popupScreen.on();

        // adjust the cordinate. 
        // these lines should be stage unique.
        this.popupScreen.sprite.y  = this.camera.view.centerY + game.world.height / 3; 
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
        // var tempThis = this;
        // this.game.robots.children.forEach(function (r) {

        for (var i = 0; i < this.game.robots.length; i ++ ){

            var r = this.game.robots.children[i];

            if (this.checkOverlap(this.player.sprite, r)) {
                // if the player and a robot overlap, 

                if (!r.vulnerable && this.playerAttackFromLeft(r) ) {
                    r.vulnerable = true;
                    // message = "CONGRATULATIONS! \n You just defeated your first evil robot!"
                    // this.initPopupCard(game, message);
                    this.popupScreen.setText("CONGRATULATIONS! \n You just defeated your first evil robot!");
                    this.popupScreen.on();
                }
                else if (!r.vulnerable && this.playerAttackFromRight(r)) {
                    r.vulnerable = true;
                    message = "CONGRATULATIONS! \n You just defeated your first evil robot!"
                    this.initPopupCard(game, message);
                }

                if (!r.vulnerable && !invincibilityOn) {
                    this.screenShake();
                    this.playerDamaged();
                }

            }
        }

        // this.playerVictory();
        Robot.updateRobots(game);

        this.collectItem(this.itemBox, game);
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
                var item = gameItems[randomItem];
                this.player.items[item]++;

                // rest of the code in this collectItem should only be for level 1 after player got his/her very first game item ever
                // var message = "CONGRATULATIONS! \n You just received your first game item! \n After clicking OK, Press spacebar\n to view inventory."
                // this.popupScreen = new Popup(game, message);
                this.popupScreen.setText("CONGRATULATIONS! \n You just received your first game item! \n After clicking OK, Press spacebar\n to view inventory.");
                console.log('33');
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
                var dist1 = Math.abs(player.body.x - this.item.children[i].holdbox1);
                var dist2 = Math.abs(player.body.x - this.item.children[i].holdbox2);

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
    initItemBox: function () {
        var itemBoxPos = Tile.findObjectsByType('itemBox', map, 'objectsLayer')[0];
        this.itemBox = this.add.sprite(itemBoxPos.x, itemBoxPos.y, 'itemBox');
        this.itemBox.taken = false;
        this.itemBox.animations.add('normal', [0, 1, 2, 3], 10, true);
        this.itemBox.animations.play('normal');
    },

    initText: function () {
        // the level
        this.levelText = this.add.text(100, 70, 'Level:' + Level, { font: '32px Aclonica', fill: '#000' });

        //  The score
        this.scoreText = this.add.text(100, 100, 'Score: 0', { font: '32px Aclonica', fill: '#000' });

        this.levelText.fixedToCamera = true;
        this.scoreText.fixedToCamera = true;

        // toggle button for input.
        this.toggleInputBtnKeyboard = this.add.button(100, 140, 'toggleInputBtnKeyboard', this.toggleOnClick, this, 2, 1, 0);
        this.toggleInputBtnKeyboard.scale.setTo(0.5, 0.5);
        this.toggleInputBtnKeyboard.fixedToCamera = true;
        this.toggleInputBtnKeyboard.WASDIcon = this.add.image(240, 140, 'WASDIcon');
        this.toggleInputBtnKeyboard.WASDIcon.scale.setTo(0.5, 0.5);
        this.toggleInputBtnKeyboard.WASDIcon.fixedToCamera = true;
        this.toggleInputBtnKeyboard.cursorIcon = this.add.image(320, 140, 'cursorIcon');
        this.toggleInputBtnKeyboard.cursorIcon.scale.setTo(0.5, 0.5);
        this.toggleInputBtnKeyboard.cursorIcon.fixedToCamera = true;


        this.toggleInputBtnMouse = this.add.button(100, 140, 'toggleInputBtnMouse', this.toggleOnClick, this, 2, 1, 0);
        this.toggleInputBtnMouse.scale.setTo(0.5, 0.5);
        this.toggleInputBtnMouse.fixedToCamera = true;
        this.toggleInputBtnMouse.visible = false;
        this.toggleInputBtnMouse.mouseIcon = this.add.image(240, 140, 'mouseIcon');
        this.toggleInputBtnMouse.mouseIcon.scale.setTo(0.5, 0.5);
        this.toggleInputBtnMouse.mouseIcon.fixedToCamera = true;
        this.toggleInputBtnMouse.mouseIcon.visible = false;

    },
    toggleOnClick: function () {
        if (this.toggleInputBtnKeyboard.visible == true) {
            console.log('toggle keyboard turns Off');
        } else {
            console.log('toggle mouse turns off');
        }

        this.toggleInputBtnKeyboard.visible = !this.toggleInputBtnKeyboard.visible;
        this.toggleInputBtnKeyboard.WASDIcon.visible = !this.toggleInputBtnKeyboard.WASDIcon.visible;
        this.toggleInputBtnKeyboard.cursorIcon.visible = !this.toggleInputBtnKeyboard.cursorIcon.visible;

        this.toggleInputBtnMouse.visible = !this.toggleInputBtnMouse.visible;
        this.toggleInputBtnMouse.mouseIcon.visible = !this.toggleInputBtnMouse.mouseIcon.visible;

    },

    initEnemies: function () {

        this.enemies = this.add.group();


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
    initDrones: function () {
        this.drones = this.add.group();
        _drone1Start = Tile.findObjectsByType('drone1Start', map, 'objectsLayer')
        _drone1Left = Tile.findObjectsByType('drone1Left', map, 'objectsLayer')
        _drone1Right = Tile.findObjectsByType('drone1Right', map, 'objectsLayer');

        this.drone1 = this.factoryDrone(_drone1Start[0].x, _drone1Start[0].y);
        this.drone1.leftPos = _drone1Left;
        this.drone1.rightPos = _drone1Right;

        this.camera.follow(this.drone1);

    },

    factoryDrone: function (x, y) {
        var d = this.drones.create(x, y, 'drone');
        this.physics.p2.enable(d, true);
        d.animations.add('left', [0, 1], 10, true);
        d.animations.add('left_damaged', [2, 3], 10, true)
        d.animations.add('right', [4, 5], 10, true);
        d.animations.add("right_damaged", [6, 7], 10, true);

        d.animations.play("left");
        d.face = 'left';
    },

    updateDrones: function () {
        this.drones.children.forEach(function (d) {
            if (d.state == 'patrol') {
                // goomba
                if (d.body.x < d.leftPos) {
                    d.face = 'right';
                    d.body.moveRight(100);

                } else if (d.leftPos < d.body.x < d.rightPos) {
                    if (d.face == "left") {
                        d.body.moveLeft(100);
                    } else {
                        d.body.moveRight(100);
                    }
                }

                else {
                    d.face = 'left';
                    d.body.moveLeft(100);
                }

            } else {
                // trace player
            }
        })
    },

    initRobots: function () {
        this.game.robots = this.add.group();
        console.log(Tile);
        _robot1Start = Tile.findObjectsByType('robot1Start', map, 'objectsLayer')
        _robot1Left = Tile.findObjectsByType('robot1Left', map, 'objectsLayer')
        _robot1Right = Tile.findObjectsByType('robot1Right', map, 'objectsLayer');
        console.log(this);
        this.robot1 = Robot.factoryRobot(this.game, _robot1Start[0].x, _robot1Start[0].y);
        this.robot1.robot1Left = _robot1Left;
        this.robot1.robot1Right = _robot1Right
    },

    initVolIcon: function () {
        var volIcon = this.add.sprite(this.camera.view.centerX + this.game.width / 2.5, this.camera.view.centerY + this.game.height / 2.5, icon);
        volIcon.anchor.setTo(0.5, 0.5);

        var volBtn = this.add.button(this.camera.view.centerX + this.game.width / 2.5, this.camera.view.centerY + this.game.height / 2.5, 'volBtn', function () {
            if (!volumeOn) {
                icon = 'volDownIcon';
                volIcon.loadTexture(icon);
                volumeOn = !volumeOn;
                music.mute = true;
                pop.mute = true;
                crash.mute = true;
            }
            else {
                icon = 'volUpIcon';
                volIcon.loadTexture(icon);
                volumeOn = !volumeOn;
                music.mute = false;
                pop.mute = false;
                crash.mute = false;
            }
        }, 2, 1, 0);

        volBtn.anchor.setTo(0.5, 0.5);
        volBtn.width = 55;
        volBtn.height = 60;
        volBtn.fixedToCamera = true;
        volIcon.fixedToCamera = true;
        this.world.bringToTop(volIcon);
    },
    // playerVictory: function () {
    //     if (playerEndPos[0].x - 5 < player.body.x && playerEndPos[0].x + 5 > player.body.x) {
    //         console.log("victory!");
    //     }
    // },
    initHealthBar: function () {

        this.healthPoint = 6;

        this.healthbar = this.add.image(this.camera.view.width - 120, 120, 'healthbar');
        this.healthbar.anchor.setTo(0, 0);
        this.healthbar.scale.setTo(1, this.healthPoint);
        this.healthbar.fixedToCamera = true;


        // console.log(this.camera.view);
        this.heart = this.add.sprite(this.camera.view.width - 80, 120, 'heartbeat');
        this.heart.anchor.setTo(0.5, 0.5);

        this.heart.animations.add('normal', [0, 1, 2, 3, 4, 5], 10, true);

        this.heart.animations.add('slow', [0, 0, 1, 2, 3, 3, 4, 5], 10, true);
        this.heart.animations.add('quick', [0, 2, 4, 5], 10, true);

        this.heart.animations.play('slow');

        this.heart.fixedToCamera = true;



    },
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
                // this.confirmCard.noBtn.destroy();
                // this.confirmCard.noIcon.destroy();
                // this.confirmCard.okBtn.destroy();
                // this.confirmCard.okIcon.destroy();
                // this.confirmCard.image.destroy();
                // this.confirmCard.txt.destroy();
                // this.confirmCard.sprite.destroy();
                // this.confirmBool = false;

                this.pausedScreen.confirmOff();
                console.log(565);

                // this.popupScreen.pauseBool = true;
                // for (var i = 0; i < popupScreen.pauseScreenBtns.length; i++) {
                //     popupScreen.pauseScreenBtns[i].inputEnabled = true;
                // }
            } else if (this.pausedScreen.pauseBool) {

                console.log(573);
                this.pausedScreen.off();


                // Unpause the game
                // key.game.paused = false; // this has been done in PausedScreen.js
                // pause = false;// this has been done in PausedScreen.js
            }
        }
    },


}
