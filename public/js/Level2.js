BackTogether.Level2 = function (game) {

};


var platformLayer;
var pausedLayer;
var objectsLayer;
var keys;
var iKeyDown = false;
var playAgain;
var mainMenu;
var next;
var player;

var playerStartPos;
var playerEndPos;

BackTogether.Level2.prototype = {

    create: function (game) {

        game.physics.startSystem(Phaser.Physics.P2JS);

        WebFont.load(wfconfig);
        this.stage.backgroundColor = "#3A5963";
        map = this.add.tilemap('lvl2', 64, 64);
        map.addTilesetImage('tileset2');

        WebFont.load(wfconfig);

        platformLayer = map.createLayer('platformLayer');

        platformLayer.resizeWorld();


        map.setCollisionBetween(1, 10);
        // setCollisionBetween takes two indexes, starting and ending position.
        // BlackTile is at 1st position, RedTile is at 2nd position,
        // (1,1) makes only BlackTile collidable.

        this.tableTops = this.game.add.group();
        this.tableTops.enableBody = true;

        result = this.findObjectsByType('tableTop', map, 'objectsLayer');

        result.forEach(function (element) {
            this.createFromTiledObject(element, this.tableTops);
        }, this);

        this.score = 0;

        this.physics.p2.convertTilemap(map, platformLayer);

        this.physics.p2.restitution = 0;
        this.physics.p2.gravity.y = 300;

        this.initPlayer();
        this.initItems();
        this.initText();
        this.initTimer();
        this.initRobots();
        this.initDrones();

        this.initTables();

        this.capsules = this.add.group();



        var inputs = [
            Phaser.Keyboard.ONE,
            Phaser.Keyboard.TWO,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR,
            Phaser.Keyboard.W,
            Phaser.Keyboard.A,
            Phaser.Keyboard.S,
            Phaser.Keyboard.D,
            Phaser.Keyboard.O,
            Phaser.Keyboard.P,
            Phaser.Keyboard.I
        ];
        var name = [
            'ONE', 'TWO', 'UP', 'LEFT', 'RIGHT', 'DOWN', 'SPACE', 'W', 'A', 'S', 'D', 'O', 'P', 'I'
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
                mmBtn.destroy();
                mmIcon.destroy();
                inventoryBtn.destroy();
                inventoryTxt.destroy();

                for (var i = 0; i < player.itemBtns.length; i++) {
                    player.itemBtns[i].destroy();
                }
                for (var i = 0; i < player.itemNums.length; i++) {
                    player.itemNums[i].destroy();
                }
                player.itemBtns = [];
                player.itemNums = [];

                // Unpause the game
                game.paused = false;
            }
        }


        this.initVolIcon();


    },

    update: function (game) {

        //        console.log(player.body.x + " " this.robots.x);
        for (var i = 0; i < this.items.length; i++) {
            this.items.children[i].frame = 0;
        }

        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (this.time.now < player.damagedTime) {
            if (player.face == 'left') {
                player.animations.play('left_damaged')
                player.body.velocity.x = 100;
            } else {
                player.animations.play("right_damaged")
                player.body.velocity.x = -100;
            }

            player.damaged = true;

        } else {


            var tempCheckOverlap = this.checkOverlap;
            var tempThis = this;

            var hidePopUpBool = false;

            this.drones.children.forEach(function (d) {
                if (tempCheckOverlap(player, d.light) && !invincibilityOn && !(tempThis.isUnderTable(player))) {

                    if (d.detectTime > 0) {
                        tempThis.screenShake();

                        d.detectTime -= 20;
                        d.light.animations.frame = 1;
                        d.light.scale.setTo(1 * d.detectTime / 1000, 3 * d.detectTime / 1000)
                        hidePopUpBool = true;


                        if (d.detectTime <= 0) {
                            d.firingRobotTime = tempThis.time.now + 3000;
                            d.light.scale.setTo(1, 3);
                            d.light.animations.frame = 2;

                        }
                    }
                } else {

                    d.light.scale.setTo(1, 3);
                    d.light.animations.frame = 0;
                }


                if (d.detectTime <= 0) {
                    d.light.animations.frame = 2;

                    var t = d.firingRobotTime - tempThis.time.now;
                    // console.log(t);
                    if (t > 2000) {
                        d.firingRobotCounting3Text.visible = true;
                    } else if (t > 1000) {
                        d.firingRobotCounting3Text.visible = false;
                        d.firingRobotCounting2Text.visible = true;

                    } else if (t > 0) {
                        d.firingRobotCounting2Text.visible = false;
                        d.firingRobotCounting1Text.visible = true;

                    } else {
                        d.firingRobotCounting1Text.visible = false;

                        d.detectTime = 1000;

                        var c = tempThis.capsules.create(d.x, d.y, 'capsule');
                        c.animations.frame = 0;
                        tempThis.physics.p2.enable(c);
                        c.body.data.gravityScale = 10;
                        c.body.setCircle(25);
                        if (d.body.velocity.x > 0) {
                            c.body.velocity.x = 400;
                        } else {
                            c.body.velocity.x = -400;
                        }

                        c.hatchingTime = tempThis.time.now + 10000;

                    }
                }


            });

            if (hidePopUpBool) {
                this.hidePopUp.visible = true;
            } else {
                this.hidePopUp.visible = false;
            }


            var now = tempThis.time.now;
            tempThis.capsules.children.forEach(function (c, i, object) {
                var t = c.hatchingTime - now;
                if (t > 5000) {

                } else if (t > 1000) {

                    var circle = 25 + (80 - 25) * (5000 - t) / 4000;
                    var scale = 1 + (3.2 - 1) * (5000 - t) / 4000;

                    c.scale.setTo(scale, scale);
                    c.body.setCircle(circle);
                }
                else if (t > 500) {

                }
                else if (t > 400) {
                    c.animations.frame = 1;
                } else if (t > 300) {
                    c.animations.frame = 2;
                } else if (t > 200) {
                    c.animations.frame = 3;
                } else if (t > 100) {
                    c.animations.frame = 4;
                } else if (t > 0) {

                    tempThis.robot1 = tempThis.factoryRobot(c.x, c.y);
                    c.destroy();

                    object.slice(i, 1); // remove the capsule from the array;
                }

            });





            if (keys['LEFT'].isDown || keys['A'].isDown) {
                //  Move to the left
                player.body.velocity.x = -800;

                player.animations.play('left');
                player.face = 'left';
            }
            else if (keys['RIGHT'].isDown || keys['D'].isDown) {
                //  Move to the right
                player.body.velocity.x = 800;

                player.animations.play('right');
                player.face = 'right';
            } else {

                if (player.damaged && player.face == 'left') {
                    player.animations.play('left');
                    player.animations.stop();
                    player.damaged = false;
                } else if (player.face == 'left') {
                    player.animations.stop();
                } else if (player.damaged && player.face == 'right') {
                    player.animations.play('right');
                    player.animations.stop();
                    player.damaged = false;
                } else if (player.face == 'right') {
                    player.animations.stop();
                }
            }

        }


        for (var i = 0; i < this.items.length; i++) {
            if (this.items.children[i].held) {
                this.items.children[i].body.y = player.body.y;
                this.items.children[i].body.x = player.body.x - this.pipe1.offset * (7 / 10);
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

        if (keys['O'].isDown) {
            this.game.state.start('WinScreen');
        }

        if (keys['P'].isDown) {
            this.game.state.start('LoseScreen');
        }

        if (keys['ONE'].isDown) {
            Level = 'ONE';
            this.game.state.start('Level1');
        }
        if (keys['TWO'].isDown) {
            this.game.state.start('Level2');
        }

        if (keys['I'].isDown && !iKeyDown) {
            iKeyDown = true;
            if (!invincibilityOn) {
                invincibilityOn = true;
            }
            else {
                invincibilityOn = false;
            }
        }
        if (keys['I'].isUp) {
            iKeyDown = false;
        }

        this.updateRobots();
        this.updateDrones();

    },

    checkOverlap: function (spriteA, spriteB) {
        // console.log(spriteB);
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
        if (player.damagedTime < this.time.now) {
            player.damagedTime = this.time.now + 1000;
            if (player.face == 'left') {
                player.face = 'left_damagd';
            } else {
                player.face = 'right_damaged';
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
    initPlayer: function () {
        // The player and its settings
        playerStartPos = this.findObjectsByType('playerStart', map, 'objectsLayer')
        playerEndPos = this.findObjectsByType('playerEnd', map, 'objectsLayer');
        player = this.add.sprite(playerStartPos[0].x, playerStartPos[0].y, 'arm');

        //  We need to enable physics on the player
        this.physics.p2.enable(player, true);

        player.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 5), 10, true);
        player.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 5), 10, true);
        player.animations.add('left_damaged', Phaser.Animation.generateFrameNames('left_damaged', 1, 2), 10, true);
        player.animations.add('right_damaged', Phaser.Animation.generateFrameNames('right_damaged', 1, 2), 10, true);


        player.animations.play('left');
        player.face = 'left';

        player.body.clearShapes();
        // player.body.addPolygon({}, [[0,54],[128,54],[112,-10],[16,-10]]);
        player.body.addRectangle(128, 30, 0, 10);
        player.body.addRectangle(80, 70, 0, -10);


        this.camera.follow(player);

        player.damaged = false;
        player.damagedTime = 0;

        // player.items = ['invisible', 'stink', 'invisible'];
        player.items = { 'invisible': 2, 'stink': 1 };
        player.itemBtns = [];
        player.itemNums = [];

    },
    findObjectsByType: function (type, map, layer) {
        var result = new Array();
        console.log("******looking for ");
        console.log(type);
        map.objects[layer].forEach(function (element) {

            console.log(element.properties.type);
            if (element.properties.type === type) {
                console.log("!!!!!!!!!!!!!!!!!!!found")
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        console.log("### find")
        console.log(result);
        return result;

    },
    //create a sprite from an object
    createFromTiledObject: function (element, group) {
        var sprite = group.create(element.x, element.y, element.properties.sprite);

        //copy all properties to the sprite
        Object.keys(element.properties).forEach(function (key) {
            sprite[key] = element.properties[key];
        });
    },


    initText: function () {
        // the level
        this.levelText = this.add.text(100, 70, 'Level:' + Level, { font: '32px Aclonica', fill: '#000' });

        //  The score
        this.scoreText = this.add.text(100, 100, 'Score: 0', { font: '32px Aclonica', fill: '#000' });
        this.levelText.fixedToCamera = true;
        this.scoreText.fixedToCamera = true;

        this.hidePopUp = this.add.image(this.camera.view.centerX, this.camera.view.centerY, 'hidePopUp');
        this.hidePopUp.scale.setTo(7, 7);
        this.hidePopUp.anchor.setTo(0.5, 0.5);
        this.hidePopUp.fixedToCamera = true;
        this.hidePopUp.visible = false;

    },

    findObjectsByType: function (type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function (element) {
            if (element.properties.type === type) {
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
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
    initDrones: function () {
        this.drones = this.add.group();
        _drone1Start = this.findObjectsByType('d1s', map, 'objectsLayer')
        this.drone1 = this.factoryDrone(_drone1Start[0].x, _drone1Start[0].y);
        this.drone1.leftPos = this.findObjectsByType('d1l', map, 'objectsLayer')[0];
        this.drone1.rightPos = this.findObjectsByType('d1r', map, 'objectsLayer')[0];
        console.log(this.drone1.leftPos);


        _drone2Start = this.findObjectsByType('d2s', map, 'objectsLayer')
        this.drone2 = this.factoryDrone(_drone2Start[0].x, _drone2Start[0].y);
        this.drone2.leftPos = this.findObjectsByType('d2l', map, 'objectsLayer')[0];
        this.drone2.rightPos = this.findObjectsByType('d2r', map, 'objectsLayer')[0];
        console.log(this.drone2.leftPos);


        _drone3Start = this.findObjectsByType('d3s', map, 'objectsLayer')
        this.drone3 = this.factoryDrone(_drone3Start[0].x, _drone3Start[0].y);
        this.drone3.leftPos = this.findObjectsByType('d3l', map, 'objectsLayer')[0];
        this.drone3.rightPos = this.findObjectsByType('d3r', map, 'objectsLayer')[0];
        console.log(this.drone3.leftPos);


        _drone4Start = this.findObjectsByType('d4s', map, 'objectsLayer')
        this.drone4 = this.factoryDrone(_drone4Start[0].x, _drone4Start[0].y);
        this.drone4.leftPos = this.findObjectsByType('d4l', map, 'objectsLayer')[0];
        this.drone4.rightPos = this.findObjectsByType('d4r', map, 'objectsLayer')[0];
        console.log(this.drone4.leftPos);


        _drone5Start = this.findObjectsByType('d5s', map, 'objectsLayer')
        this.drone5 = this.factoryDrone(_drone5Start[0].x, _drone5Start[0].y);
        this.drone5.leftPos = this.findObjectsByType('d5l', map, 'objectsLayer')[0];
        this.drone5.rightPos = this.findObjectsByType('d5r', map, 'objectsLayer')[0];
        console.log(this.drone5.leftPos);


    },

    factoryDrone: function (x, y) {
        var d = this.drones.create(x, y, 'drone');

        d.detectTime = 1000;

        this.physics.p2.enable(d, true);
        d.animations.add('left', [0, 1], 10, true);
        d.animations.add('left_damaged', [2, 3], 10, true)
        d.animations.add('right', [4, 5], 10, true);
        d.animations.add("right_damaged", [6, 7], 10, true);

        d.light = this.add.sprite(x, y + 30, 'droneLight');
        this.physics.p2.enable(d.light, true);
        d.light.body.data.gravityScale = 0;
        d.light.anchor.setTo(0.5, 0);
        d.light.scale.setTo(1, 3);
        d.light.animations.frame = 0;
        d.light.body.clearShapes();
        d.light.sendToBack();

        d.lightShadow = this.add.sprite(x, y + 30, 'droneLight');
        this.physics.p2.enable(d.lightShadow, true);
        d.lightShadow.body.data.gravityScale = 0;
        d.lightShadow.anchor.setTo(0.5, 0);
        d.lightShadow.scale.setTo(1, 3);
        d.lightShadow.animations.frame = 0;
        d.lightShadow.body.clearShapes();
        d.lightShadow.sendToBack();


        d.firingRobotCounting1Text = this.add.text(x, y + 200, '1', { font: '64px Aclonica', fill: '#B71C1C' });
        d.firingRobotCounting1Text.visible = false;
        d.firingRobotCounting1Text.scale.setTo(3, 3);
        d.firingRobotCounting1Text.anchor.setTo(0.5,0.5);

        d.firingRobotCounting2Text = this.add.text(x, y + 300, '2', { font: '64px Aclonica', fill: '#B71C1C' });
        d.firingRobotCounting2Text.visible = false;
        d.firingRobotCounting2Text.scale.setTo(3, 3);
        d.firingRobotCounting2Text.anchor.setTo(0.5,0.5);

        d.firingRobotCounting3Text = this.add.text(x, y + 400, '3', { font: '64px Aclonica', fill: '#B71C1C' });
        d.firingRobotCounting3Text.visible = false;
        d.firingRobotCounting3Text.scale.setTo(3, 3);
        d.firingRobotCounting3Text.anchor.setTo(0.5,0.5);



        d.anchor.setTo(0.5, 0.5);

        d.body.clearShapes();

        d.animations.play("left");
        d.face = 'left';

        // d.body.mass = 0;
        d.body.data.gravityScale = 0;
        d.state = 'patrol';
        return d;
    },

    updateDrones: function () {
        this.drones.children.forEach(function (d) {
            if (d.state == 'patrol') {
                // goomba
                // console.log(d.rightPos[0].x);
                if (d.body.x < d.leftPos.x) {
                    d.face = 'right';
                    d.body.moveRight(100);
                    d.light.body.moveRight(100);
                    d.lightShadow.body.moveRight(100);
                    d.firingRobotCounting1Text.x = d.body.x;
                    d.firingRobotCounting2Text.x = d.body.x;
                    d.firingRobotCounting3Text.x = d.body.x;

                } else if (d.leftPos.x <= d.body.x && d.body.x <= d.rightPos.x) {

                    if (d.face == "left") {

                        d.body.moveLeft(100);
                        d.light.body.moveLeft(100);
                        d.lightShadow.body.moveLeft(100);
                        d.firingRobotCounting1Text.x = d.body.x;
                        d.firingRobotCounting2Text.x = d.body.x;
                        d.firingRobotCounting3Text.x = d.body.x;

                        d.animations.play('left');


                    } else {

                        d.body.moveRight(100);
                        d.light.body.moveRight(100);
                        d.lightShadow.body.moveRight(100);
                        d.firingRobotCounting1Text.x = d.body.x;
                        d.firingRobotCounting2Text.x = d.body.x;
                        d.firingRobotCounting3Text.x = d.body.x;

                        d.animations.play('right');

                    }
                }

                else {
                    d.face = 'left';
                    d.body.moveLeft(100);
                    d.light.body.moveLeft(100);
                    d.lightShadow.body.moveLeft(100);
                    d.firingRobotCounting1Text.x = d.body.x;
                    d.firingRobotCounting2Text.x = d.body.x;
                    d.firingRobotCounting3Text.x = d.body.x;

                }

            } else {
                // trace player
            }
        })
    },


    initRobots: function () {
        this.robots = this.add.group();

        // _robot1Start = this.findObjectsByType('robot1Start', map, 'objectsLayer')
        // _robot1Left = this.findObjectsByType('robot1Left', map, 'objectsLayer')
        // _robot1Right = this.findObjectsByType('robot1Right', map, 'objectsLayer');

        // this.robot1 = this.factoryRobot(_robot1Start[0].x, _robot1Start[0].y);
        // this.robot1.robot1Left = _robot1Left[0];
        // this.robot1.robot1Right = _robot1Right[0];

    },

    factoryRobot: function (x, y) {
        var r = this.robots.create(x, y, 'robot');
        this.physics.p2.enable(r, true);

        r.animations.add('leftIdle', Phaser.Animation.generateFrameNames('l', 1, 22), 10, true);
        r.animations.add('rightIdle', Phaser.Animation.generateFrameNames('r', 1, 22), 10, true);
        r.animations.add('left', Phaser.Animation.generateFrameNames('leftWalk', 1, 2), 10, true);
        r.animations.add('right', Phaser.Animation.generateFrameNames('rightWalk', 1, 2), 10, true);

        r.animations.play("left");
        r.state = 'left';

        r.body.clearShapes();

        r.body.addCircle(24, 0, -76);
        r.body.addRectangle(59, 90, 0, -8);
        r.body.addRectangle(155, 55, 0, 67);

        r.body.velocity.x = 100;
        r.body.velocity.y = 0;

        r.states = [['left', 'idle'], ['left', 'left'],
        ['right', 'idle'], ['right', 'right'],
        ['idle', 'idle'], ['idle', 'left'], ['idle', 'right']];
        r.state = 'idle';
        r.switchedOff = false;
        r.vulnerable = false;
        r.stateTime = this.time.now;
        return r;
    },
    updateRobots: function () {

        var timeNow = this.time.now;

        this.robots.children.forEach(function (r, i, obj) {
            if (!r.switchedOff) {

                if (timeNow > r.stateTime) {
                    if (r.state == "left") {
                        r.state = "leftIdle";
                        r.stateTime = timeNow + 3000;
                    } else if (r.state == "right") {
                        r.state = "rightIdle";
                        r.stateTime = timeNow + 3000;
                    } else { // r.state == "leftIdle" or r.state == "rightIdle"
                        if (Math.random() < 0.9) {
                            if (r.state == "leftIdle") {
                                r.state = 'rightIdle';
                            } else {
                                r.state = 'leftIdle';
                            }

                            r.stateTime = timeNow + 2000;
                        } else {
                            if (Math.random() < 0.5) {
                                r.state = 'left';
                            } else {
                                r.state = 'right';
                            }

                            r.stateTime = timeNow + 3000;
                        }

                    }


                } else {
                    r.animations.play(r.state);
                    if (r.state == 'left') {
                        r.body.moveLeft(100);
                    } else if (r.state == 'right') {
                        r.body.moveRight(100);
                    }

                }

            }
            else {
                // if the robot is attacked, and it is already dead,


                r.body.velocity.x = 0;
                r.animations.frame = 0;
                r.alpha -= 0.005;               // change opacity so that it looks like it disappear.
                if (r.alpha <= 0) {
                    console.log(obj);

                    console.log('disappear');
                    r.destroy();
                    obj.slice(i, 1); // remove the dead robot from the array.
                    console.log(obj);

                }
            }
        });

    },
    initPausedScreen: function (game) {
        pausedLayer = map.createLayer('pausedLayer');
        pausedLayer.resizeWorld();
        pausedLayer.alpha = 0.6;
        game.paused = true;

        pausedBtnCard = this.add.sprite(this.camera.view.centerX, this.camera.view.centerY, 'pausedBtnCard')
        pausedBtnCard.anchor.setTo(0.5, 0.5);
        pausedBtnCard.scale.setTo(2.5, 2.5);

        cancelBtn = this.add.button(this.camera.view.centerX + 235, this.camera.view.centerY - 110, 'cancelIcon', this.resumeOnClick, game, 2, 1, 0);
        cancelBtn.anchor.setTo(0.5, 0.5);
        cancelBtn.scale.setTo(0.3, 0.3);

        pausedBtnCardText = this.add.text(this.camera.view.centerX, this.camera.view.centerY + 260, 'Press Spacebar to resume', { font: '32px Aclonica', fill: '#FFF' });
        pausedBtnCardText.anchor.setTo(0.5, 0.5);

        mmBtn = this.add.button(this.camera.view.centerX - 134, this.camera.view.centerY + 55, 'pausedBtn', function () {
            pausedLayer.destroy();
            cancelBtn.destroy();
            pausedBtnCard.destroy();
            pausedBtnCardText.destroy();
            resetBtn.destroy();
            resetIcon.destroy();
            mmBtn.destroy();
            mmIcon.destroy();
            inventoryBtn.destroy();
            inventoryTxt.destroy();

            for (var i = 0; i < player.itemBtns.length; i++) {
                player.itemBtns[i].destroy();
            }
            for (var i = 0; i < player.itemNums.length; i++) {
                player.itemNums[i].destroy();
            }

            player.itemBtns = [];
            player.itemNums = [];

            // Unpause the game
            this.paused = false;

            game.state.start('MainMenu')
        }, game, 2, 1, 0);

        mmBtn.anchor.setTo(0.5, 0.5);
        mmBtn.scale.setTo(1.6, 1.6);

        mmIcon = this.add.sprite(this.camera.view.centerX - 134, this.camera.view.centerY + 55, 'mainMenuIcon');
        mmIcon.anchor.setTo(0.5, 0.5);
        mmIcon.scale.setTo(0.8, 0.8);


        resetBtn = this.add.button(this.camera.view.centerX - 134, this.camera.view.centerY - 55, 'pausedBtn', this.resetOnClick, game, 2, 1, 0);
        resetBtn.anchor.setTo(0.5, 0.5);
        resetBtn.scale.setTo(1.6, 1.6);

        resetIcon = this.add.sprite(this.camera.view.centerX - 134, this.camera.view.centerY - 55, 'resetIcon');
        resetIcon.anchor.setTo(0.5, 0.5);
        resetIcon.scale.setTo(0.8, 0.8);


        inventoryBtn = this.add.image(this.camera.view.centerX + 79, this.camera.view.centerY, 'pausedBtn');
        inventoryBtn.anchor.setTo(0.5, 0.5);
        inventoryBtn.scale.setTo(3.8, 3.8);

        inventoryTxt = this.add.text(this.camera.view.centerX + 79, this.camera.view.centerY - 68, 'inventory', { font: '32px Aclonica', fill: '#000' });
        inventoryTxt.anchor.setTo(0.5, 0.5);

        var i = 0;
        for (var key in player.items) {
            if (!player.items.hasOwnProperty(key)) continue;

            var obj = player.items[key];

            var x = this.camera.view.centerX + i * 32;
            var y = this.camera.view.centerY - 58 + i + 32

            var item1 = this.add.button(x, y, key, this.inventoryItemOnClick, game, 2, 1, 0);
            item1.anchor.setTo(0.5, 0.5);
            player.itemBtns.push(item1);

            var num = this.add.text(x + 16, y + 16, obj, { font: '32px Aclonica', fill: '#000' });
            num.anchor.setTo(0.5, 0.5);
            num.scale.setTo(0.5, 0.5);
            player.itemNums.push(num);

            i += 1;
        }

    },
    resetOnClick: function () {
        this.score = 0;
        this.state.restart();
        this.paused = false;
    },
    settingOnClick: function () {
        console.log('setting button clicked');
    },
    restartLvl: function () {
        this.game.state.start('LevelSelecting');
    },
    returnMM: function () {
        this.game.state.start('MainMenu');
    },
    nextLvl: function () {
        console.log("to be implemented");
    },

    resumeOnClick: function () {
        pausedLayer.destroy();
        cancelBtn.destroy();
        pausedBtnCard.destroy();
        pausedBtnCardText.destroy();
        resetBtn.destroy();
        resetIcon.destroy();
        mmBtn.destroy();
        mmIcon.destroy();
        inventoryBtn.destroy();
        inventoryTxt.destroy();

        for (var i = 0; i < player.itemBtns.length; i++) {
            player.itemBtns[i].destroy();
        }
        for (var i = 0; i < player.itemNums.length; i++) {
            player.itemNums[i].destroy();
        }

        player.itemBtns = [];
        player.itemNums = [];

        // Unpause the game
        this.paused = false;
    },
    inventortOnClick: function () {
        inventoryTxt.visible = !inventoryTxt.visible;
        item1.visible = !item1.visible;
    },
    inventoryItemOnClick: function (e) {
        console.log('inventory item pressed');
        console.log(e.key);
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
    initTimer: function () {

        this.healthPoint = 6000;

        this.healthbar = this.add.image(this.camera.view.width - 120, 120, 'healthbar');
        this.healthbar.anchor.setTo(0, 0);
        this.healthbar.scale.setTo(1, this.healthPoint / 1000);
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
    initTables: function () {

        this.tables = [];

        var t = [this.findObjectsByType('table1Left', map, 'objectsLayer')[0], this.findObjectsByType('table1Right', map, 'objectsLayer')[0]];
        this.tables.push(t);

        var t = [this.findObjectsByType('table2Left', map, 'objectsLayer')[0], this.findObjectsByType('table2Right', map, 'objectsLayer')[0]];
        this.tables.push(t);

        var t = [this.findObjectsByType('table3Left', map, 'objectsLayer')[0], this.findObjectsByType('table3Right', map, 'objectsLayer')[0]];
        this.tables.push(t);

        var t = [this.findObjectsByType('table4Left', map, 'objectsLayer')[0], this.findObjectsByType('table4Right', map, 'objectsLayer')[0]];
        this.tables.push(t);

        var t = [this.findObjectsByType('table5Left', map, 'objectsLayer')[0], this.findObjectsByType('table5Right', map, 'objectsLayer')[0]];
        this.tables.push(t);

        console.log(this.tables);

    },

    isUnderTable: function (player) {

        return this.tables.some(function (e, i, obj) {
            return e[0].x < player.body.x && player.body.x < e[1].x;
        });

    },


}
