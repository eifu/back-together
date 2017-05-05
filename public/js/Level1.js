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
var popup = false;
var confirm = false;
var pause = false;
var currentCard;        // 'currentCard' is used the objectiveCard, popupCard, confirmCard.
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

        this.initPlayer();
        // this.initItems();
        this.initText();
        this.initHealthBar();
        this.initRobots();
        this.initItemBox();
        this.initVolIcon();
        this.initKeys();

        keys['SPACE'].onDown.add(unpause, self);

        function unpause(event) {
            // Only act if paused
            if (game.paused) {
                if (popup) {
                    console.log('109');
                    currentCard.okBtn.destroy();
                    currentCard.okIcon.destroy();
                    currentCard.txt.destroy();
                    currentCard.destroy();
                    game.paused = false;
                    popup = false;

                } else if (confirm) {
                    confirmCard.noBtn.destroy();
                    confirmCard.noIcon.destroy();
                    confirmCard.okBtn.destroy();
                    confirmCard.okIcon.destroy();
                    confirmCard.image.destroy();
                    confirmCard.txt.destroy();
                    confirmCard.destroy();
                    confirm = false;
                    pause = true;
                    for (var i = 0; i < currentCard.pauseScreenBtns.length; i++) {
                        currentCard.pauseScreenBtns[i].inputEnabled = true;
                    }
                } else if (pause) {
                    pausedLayer.destroy();
                    currentCard.cancelBtn.destroy();
                    currentCard.txt.destroy();
                    currentCard.resetBtn.destroy();
                    currentCard.resetIcon.destroy();
                    currentCard.mmBtn.destroy();
                    currentCard.mmIcon.destroy();
                    currentCard.inventory.destroy();
                    currentCard.inventoryTxt.destroy();
                    currentCard.destroy();

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
                    pause = false;
                }
            }
        }



        this.initObjectiveScreen(game);

    },

    update: function (game) {
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

            var tempThis = this;
            this.robots.children.forEach(function (r) {
                if (tempThis.checkOverlap(player, r)) {
                    // if the player and a robot overlap, 

                    if (!r.switchedOff && !r.vulnerable && !invincibilityOn) {
                        tempThis.screenShake();
                        tempThis.playerDamaged();
                    }
                    else {
                        if (!r.switchedOff) {
                            message = "CONGRATULATIONS! \n You just defeated your first evil robot!"
                            tempThis.initPopupCard(game, message);
                        }
                        r.switchedOff = true;
                    }
                }
            });

            if (keys['LEFT'].isDown || keys['A'].isDown) {
                //  Move to the left
                if (player.animations.frame == 0) {
                    player.body.velocity.x = -600;
                } else if (player.animations.frame == 1) {
                    player.body.velocity.x = -800;
                } else if (player.animations.frame == 2) {
                    player.body.velocity.x = -600;
                } else {
                    player.body.velocity.x = -400;
                }
                player.animations.play('left');
                player.face = 'left';
            }
            else if (keys['RIGHT'].isDown || keys['D'].isDown) {
                //  Move to the right
                if (player.animations.frame == 4) {
                    player.body.velocity.x = 600;
                } else if (player.animations.frame == 5) {
                    player.body.velocity.x = 800;
                } else if (player.animations.frame == 6) {
                    player.body.velocity.x = 600;
                } else {
                    player.body.velocity.x = 400;
                }
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

        if (keys['SPACE'].isDown) {
            this.initPausedScreen(game);
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

        this.playerVictory();
        this.updateRobots();
        this.playerAttack();

        this.collectItem(player, this.itemBox, game);
    },
    collectItem: function (obj1, obj2, game) {
        if (this.checkOverlap(obj1, obj2)) {
            if (!obj2.taken) {
                obj2.taken = true;
                obj2.visible = false;

                //player.items will change to gameItems whenever we create more than 2 items
                var randomItem = Math.floor((Math.random() * Object.keys(obj1.items).length));
                var item = gameItems[randomItem];
                player.items[item]++;

                // rest of the code in this collectItem should only be for level 1 after player got his/her very first game item ever
                var message = "CONGRATULATIONS! \n You just received your first game item! \n After clicking OK, Press spacebar\n to view inventory."
                this.initPopupCard(game, message);
            }
        }
    },

    initPopupCard: function (game, message) {
        popup = true;
        currentCard = this.add.sprite(this.camera.view.centerX, this.camera.view.centerY, 'popupCard')
        currentCard.anchor.setTo(0.5, 0.5);
        currentCard.scale.setTo(7, 4);
        currentCard.txt = this.add.text(this.camera.view.centerX, this.camera.view.centerY - currentCard.height / 3, message, { font: '32px Aclonica', fill: '#FFF' });
        currentCard.txt.anchor.setTo(0.5, 0);

        currentCard.okBtn = this.add.button(this.camera.view.centerX, this.camera.view.centerY + currentCard.height / 3, 'okBtn', function () {
            currentCard.destroy();
            currentCard.okBtn.destroy();
            currentCard.okIcon.destroy();
            currentCard.txt.destroy();
            console.log("a");
            game.paused = false;
            popup = false;
        }, game, 2, 1, 0);
        currentCard.okBtn.anchor.setTo(0.5, 0.5);
        currentCard.okBtn.scale.setTo(4, 4);

        currentCard.okIcon = this.add.sprite(this.camera.view.centerX, this.camera.view.centerY + currentCard.height / 3, 'okIcon');
        currentCard.okIcon.anchor.setTo(0.5, 0.5);
        game.world.bringToTop(currentCard.okIcon);
        game.paused = true;
    },

    checkOverlap: function (spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    },
    screenShake: function () {
        this.camera.shake(0.01, 100);
    },

    playerAttack: function () {
        this.robots.children.forEach(function (r) {
            if (player.body.x < r.x && player.body.velocity.x >= 0 && r.body.velocity.x >= 0 || r.switchedOff) {
                r.vulnerable = true;
            }
            else if (player.body.x > r.x && player.body.velocity.x <= 0 && r.body.velocity.x <= 0 || r.switchedOff) {
                r.vulnerable = true;
            }
            else {
                r.vulnerable = false;
            }
        }
        )
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
            crash.play();
            player.damagedTime = this.time.now + 1000;
            if (player.face == 'left') {
                player.face = 'left_damagd';
            } else {
                player.face = 'right_damaged';
            }
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
    initItemBox: function () {
        var itemBoxPos = this.findObjectsByType('itemBox', map, 'objectsLayer')[0];
        this.itemBox = this.add.sprite(itemBoxPos.x, itemBoxPos.y, 'itemBox');
        this.itemBox.taken = false;
        this.itemBox.animations.add('normal', [0, 1, 2, 3], 10, true);
        this.itemBox.animations.play('normal');
    },

    initPlayer: function () {
        // The player and its settings
        playerStartPos = this.findObjectsByType('playerStart', map, 'objectsLayer')
        playerEndPos = this.findObjectsByType('playerEnd', map, 'objectsLayer');
        player = this.add.sprite(playerStartPos[0].x, playerStartPos[0].y, 'hand');

        //  We need to enable physics on the player
        this.physics.p2.enable(player, true);

        player.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 5), 10, true);
        player.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 5), 10, true);
        player.animations.add('left_damaged', Phaser.Animation.generateFrameNames('left_damaged', 1, 2), 10, true);
        player.animations.add('right_damaged', Phaser.Animation.generateFrameNames('right_damaged', 1, 2), 10, true);


        player.animations.play('left');
        player.face = 'left';

        player.body.clearShapes();
        player.body.addPolygon({}, [[1, 42], [1, 29], [32, 20], [63, 29], [63, 42]]);


        this.camera.follow(player);

        player.damaged = false;
        player.damagedTime = 0;

        // player.items = ['invisible', 'stink', 'invisible'];
        player.items = { 'invisible': 2, 'stink': 1 };
        player.itemBtns = [];
        player.itemNums = [];

        gameItems = [];
        gameItems.push('invisible');
        gameItems.push('stink');
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
        _drone1Start = this.findObjectsByType('drone1Start', map, 'objectsLayer')
        _drone1Left = this.findObjectsByType('drone1Left', map, 'objectsLayer')
        _drone1Right = this.findObjectsByType('drone1Right', map, 'objectsLayer');

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
        this.robots = this.add.group();

        _robot1Start = this.findObjectsByType('robot1Start', map, 'objectsLayer')
        _robot1Left = this.findObjectsByType('robot1Left', map, 'objectsLayer')
        _robot1Right = this.findObjectsByType('robot1Right', map, 'objectsLayer');

        this.robot1 = this.factoryRobot(_robot1Start[0].x, _robot1Start[0].y);
        this.robot1.robot1Left = _robot1Left;
        this.robot1.robot1Right = _robot1Right
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
        pause = true;

        currentCard = this.add.sprite(this.camera.view.centerX, this.camera.view.centerY, 'pausedBtnCard')
        currentCard.anchor.setTo(0.5, 0.5);
        currentCard.scale.setTo(2.5, 2.5);

        currentCard.pauseScreenBtns = [];

        currentCard.cancelBtn = this.add.button(this.camera.view.centerX + 235, this.camera.view.centerY - 110, 'cancelIcon', this.resumeOnClick, game, 2, 1, 0);
        currentCard.cancelBtn.anchor.setTo(0.5, 0.5);
        currentCard.cancelBtn.scale.setTo(0.3, 0.3);
        currentCard.pauseScreenBtns.push(currentCard.cancelBtn);

        currentCard.txt = this.add.text(this.camera.view.centerX, this.camera.view.centerY + 260, 'Press Spacebar to resume', { font: '32px Aclonica', fill: '#FFF' });
        currentCard.txt.anchor.setTo(0.5, 0.5);

        currentCard.mmBtn = this.add.button(this.camera.view.centerX - 134, this.camera.view.centerY + 55, 'pausedBtn', function () {
            pausedLayer.destroy();
            currentCard.cancelBtn.destroy();
            currentCard.destroy();
            currentCard.txt.destroy();
            currentCardresetBtn.destroy();
            currentCard.resetIcon.destroy();
            currentCard.mmBtn.destroy();
            currentCard.mmIcon.destroy();
            currentCard.inventory.destroy();
            currentCard.inventoryTxt.destroy();

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

        currentCard.mmBtn.anchor.setTo(0.5, 0.5);
        currentCard.mmBtn.scale.setTo(1.6, 1.6);
        currentCard.pauseScreenBtns.push(currentCard.mmBtn);

        currentCard.mmIcon = this.add.sprite(this.camera.view.centerX - 134, this.camera.view.centerY + 55, 'mainMenuIcon');
        currentCard.mmIcon.anchor.setTo(0.5, 0.5);
        currentCard.mmIcon.scale.setTo(0.8, 0.8);


        currentCard.resetBtn = this.add.button(this.camera.view.centerX - 134, this.camera.view.centerY - 55, 'pausedBtn', this.resetOnClick, game, 2, 1, 0);
        currentCard.resetBtn.anchor.setTo(0.5, 0.5);
        currentCard.resetBtn.scale.setTo(1.6, 1.6);
        currentCard.pauseScreenBtns.push(currentCard.resetBtn);

        currentCard.resetIcon = this.add.sprite(this.camera.view.centerX - 134, this.camera.view.centerY - 55, 'resetIcon');
        currentCard.resetIcon.anchor.setTo(0.5, 0.5);
        currentCard.resetIcon.scale.setTo(0.8, 0.8);


        currentCard.inventory = this.add.image(this.camera.view.centerX + 79, this.camera.view.centerY, 'pausedBtn');
        currentCard.inventory.anchor.setTo(0.5, 0.5);
        currentCard.inventory.scale.setTo(3.8, 3.8);

        currentCard.inventoryTxt = this.add.text(this.camera.view.centerX + 79, this.camera.view.centerY - 68, 'inventory', { font: '32px Aclonica', fill: '#000' });
        currentCard.inventoryTxt.anchor.setTo(0.5, 0.5);

        var i = 0;
        for (var key in player.items) {
            if (!player.items.hasOwnProperty(key)) continue;

            var obj = player.items[key];

            var x = this.camera.view.centerX + i * 32;
            var y = this.camera.view.centerY - 58 + i + 32

            //            var invenTemp = this.inventoryItemOnClick(key, game);

            var item1 = this.add.button(x, y, key, this.inventoryItemOnClick, this, 2, 1, 0);
            item1.anchor.setTo(0.5, 0.5);
            player.itemBtns.push(item1);
            currentCard.pauseScreenBtns.push(item1);

            var num = this.add.text(x + 16, y + 16, obj, { font: '32px Aclonica', fill: '#000' });
            num.anchor.setTo(0.5, 0.5);
            num.scale.setTo(0.5, 0.5);
            player.itemNums.push(num);

            i += 1;
        }

    },

    initObjectiveScreen: function (game) {
        popup = true;
        currentCard = this.add.sprite(this.camera.view.centerX, this.camera.view.centerY + game.world.height / 3, 'objectiveCard')
        currentCard.anchor.setTo(0.5, 0.5);
        currentCard.scale.setTo(7, 4);
        currentCard.txt = this.add.text(this.camera.view.centerX, this.camera.view.centerY + 260, 'Objective: \n ASSASSINATION STYLE ... \n When the robot turns around, \n run against its butt.\n There is a switch to turn it off.', { font: '32px Aclonica', fill: '#FFF' });
        currentCard.txt.anchor.setTo(0.5, 0);

        currentCard.okBtn = this.add.button(this.camera.view.centerX, this.camera.view.centerY + 550, 'okBtn', function () {
            currentCard.destroy();
            currentCard.okBtn.destroy();
            currentCard.okIcon.destroy();
            currentCard.txt.destroy();
            game.paused = false;
            popup = false;
        }, game, 2, 1, 0);
        currentCard.okBtn.anchor.setTo(0.5, 0.5);
        currentCard.okBtn.scale.setTo(4, 4);

        currentCard.okIcon = this.add.sprite(this.camera.view.centerX, this.camera.view.centerY + 550, 'okIcon');
        currentCard.okIcon.anchor.setTo(0.5, 0.5);
        game.world.bringToTop(currentCard.okIcon);
        game.paused = true;
    },
    resetOnClick: function () {
        this.score = 0;
        this.state.restart();
        this.paused = false;
    },
    restartLvl: function () {
        this.game.state.start('LevelSelecting');
    },
    returnMM: function () {
        game.state.start('MainMenu');
        //        console.log(game.state);
    },
    nextLvl: function () {
        console.log("to be implemented");
    },

    resumeOnClick: function () {
        pausedLayer.destroy();
        currentCard.cancelBtn.destroy();
        currentCard.destroy();
        currentCard.txt.destroy();
        currentCard.resetBtn.destroy();
        currentCard.resetIcon.destroy();
        currentCard.mmBtn.destroy();
        currentCard.mmIcon.destroy();
        currentCard.inventory.destroy();
        currentCard.inventoryTxt.destroy();

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
    inventoryItemOnClick: function (e, game) {
        //        console.log('inventory item pressed');
        var message = "Ahhh ... " + e.key + "!\n Want to use it?";

        for (var i = 0; i < currentCard.pauseScreenBtns.length; i++) {
            currentCard.pauseScreenBtns[i].inputEnabled = false;
        }

        confirm = true;
        confirmCard = this.add.sprite(this.camera.view.centerX, this.camera.view.centerY, 'objectiveCard');
        confirmCard.anchor.setTo(0.5, 0.5);
        confirmCard.scale.setTo(7, 4);

        confirmCard.image = this.add.sprite(this.camera.view.centerX, this.camera.view.centerY - confirmCard.height / 4, e.key);
        confirmCard.image.anchor.setTo(0.5, 0.5);
        confirmCard.image.scale.setTo(3, 3);

        confirmCard.txt = this.add.text(this.camera.view.centerX, this.camera.view.centerY, message, { font: '32px Aclonica', fill: '#FFF' });
        confirmCard.txt.anchor.setTo(0.5, 0);

        confirmCard.okBtn = this.add.button(this.camera.view.centerX - confirmCard.width / 5, this.camera.view.centerY + confirmCard.height / 3, 'yesBtn', function () {
            confirmCard.noBtn.destroy();
            confirmCard.noIcon.destroy();
            confirmCard.okBtn.destroy();
            confirmCard.okIcon.destroy();
            confirmCard.image.destroy();
            confirmCard.txt.destroy();
            confirmCard.destroy();
            confirm = false;
            player.items[e.key]--;

            for (var i = 0; i < currentCard.pauseScreenBtns.length; i++) {
                currentCard.pauseScreenBtns[i].inputEnabled = true;
            }
            //            this.game.paused = false;
            //            popup = false;
        }, this, 2, 1, 0);
        confirmCard.okBtn.anchor.setTo(0.5, 0.5);
        confirmCard.okBtn.scale.setTo(4, 4);

        confirmCard.okIcon = this.add.sprite(this.camera.view.centerX - confirmCard.width / 5, this.camera.view.centerY + confirmCard.height / 3, 'okIcon');
        confirmCard.okIcon.anchor.setTo(0.5, 0.5);
        this.world.bringToTop(confirmCard.okIcon);

        confirmCard.noBtn = this.add.button(this.camera.view.centerX + confirmCard.width / 5, this.camera.view.centerY + confirmCard.height / 3, 'noBtn', function () {
            confirmCard.noBtn.destroy();
            confirmCard.noIcon.destroy();
            confirmCard.okBtn.destroy();
            confirmCard.okIcon.destroy();
            confirmCard.image.destroy();
            confirmCard.txt.destroy();
            confirmCard.destroy();
            confirm = false;
            for (var i = 0; i < currentCard.pauseScreenBtns.length; i++) {
                currentCard.pauseScreenBtns[i].inputEnabled = true;
            }
            //            this.game.paused = false;
            //            popup = false;
        }, this, 2, 1, 0);
        confirmCard.noBtn.anchor.setTo(0.5, 0.5);
        confirmCard.noBtn.scale.setTo(4, 4);

        confirmCard.noIcon = this.add.sprite(this.camera.view.centerX + confirmCard.width / 5, this.camera.view.centerY + confirmCard.height / 3, 'cancelIcon');
        confirmCard.noIcon.anchor.setTo(0.5, 0.5);
        confirmCard.noIcon.scale.setTo(1.25, 1.25);
        this.world.bringToTop(confirmCard.noIcon);
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
    playerVictory: function () {
        if (playerEndPos[0].x - 5 < player.body.x && playerEndPos[0].x + 5 > player.body.x) {
            console.log("victory!");
        }
    },
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
        var keyboard = this.input.keyboard;
        inputs.forEach(function (input, i) {
            keys[name[i]] = keyboard.addKey(input);
        });
    }

}
