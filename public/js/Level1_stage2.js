BackTogether.Level1_stage2 = function (game) {

};


var platformLayer;
var pausedLayer;
var keys;
var iKeyDown = false;
var playAgain;
var mainMenu;
var next;
var player;
var map;

BackTogether.Level1_stage2.prototype = {

    create: function (game) {
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0.8;
        WebFont.load(wfconfig);
        this.stage.backgroundColor = "#3A5963";
        map = this.add.tilemap('level1_stage2', 64, 64);
        map.addTilesetImage('tileset2');
        map.addTilesetImage('tileset3');

        platformLayer = map.createLayer('platformLayer');
        platformLayer.resizeWorld();


        game.physics.p2.setBoundsToWorld()

        map.setCollisionBetween(5, 7);


        this.physics.p2.convertTilemap(map, platformLayer);
        this.physics.p2.restitution = 0;
        this.physics.p2.gravity.y = 800;

        // can be Hand, Arm, Torso.
        this.player = new Hand(game, map);

        this.pausedScreen = new PausedScreen(game, this.player);
        this.pausedScreen.off();

        this.popupScreen = new PopupScreen(game, 'Welcome!\n The objective of stage 1 is\n to get you familiar with the controls. \nPress OK or hit space to continue.');

        var collisionObjects = game.physics.p2.convertCollisionObjects(map, 'collision', true);

        this.tilesCollisionGroup = game.physics.p2.createCollisionGroup();
        this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
        this.robotCollisionGroup = game.physics.p2.createCollisionGroup();
        this.capsuleCollisionGroup = game.physics.p2.createCollisionGroup();

        game.physics.p2.updateBoundsCollisionGroup();

        for (var i = 0; i < collisionObjects.length; i++) {


            collisionObjects[i].setCollisionGroup(this.tilesCollisionGroup);
            collisionObjects[i].collides([this.playerCollisionGroup, this.robotCollisionGroup, this.capsuleCollisionGroup]);


            console.log(collisionObjects[i]);
        }

        this.player.sprite.enableBody = true;

        this.player.sprite.body.setCollisionGroup(this.playerCollisionGroup);
        this.player.sprite.body.collides([this.tilesCollisionGroup, this.capsuleCollisionGroup]);

        // these are general purpose.
        GameScreenConfig.initText(game);
        GameScreenConfig.initHealthBar(game);
        GameScreenConfig.initVolIcon(game);
        GameScreenConfig.initObjective(game, 'Get familiar with User Controll!');

        this.initKeys();
        this.initRobots();
        this.initDrones();
        // this.initItemBox();
        this.initHitboxs();

        this.gameItems = [];
        this.gameItems.push('invisible');
        this.gameItems.push('stink');

        keys['SPACE'].onDown.add(this.unpause, this);
        keys['ENTER'].onDown.add(this.unpause, this);


        this.popupScreen.on();


        this.intro1Bool = true;
        this.intro1_2Bool = false;
        this.intro2Bool = true;
        this.intro3Bool = true;
        this.intro3_2Bool = false;
        this.intro4Bool = true;
        this.intro4_2Bool = false;
        this.intro5Bool = true;

        this.damageBool = true;


        this.capsules = [];

    },

    update: function (game) {

        this.player.update();

        if (keys['SPACE'].isDown || keys['ENTER'].isDown) {
            this.pausedScreen.on();
        }



        for (var i = 0; i < this.robots.length; i++) {

            var r = this.robots[i];
            if (!this.damageBool) {
                r.update();
            }

            if (this.checkOverlap(this.player.sprite, r.sprite)) {
                // if the player and a robot overlap, 

                if (!r.vulnerable && this.playerAttackFromLeft(r)) {
                    r.vulnerable = true;

                }
                else if (!r.vulnerable && this.playerAttackFromRight(r)) {
                    r.vulnerable = true;

                }

                if (!r.vulnerable && !this.player.damaged) {
                    this.screenShake();
                    this.playerDamaged();

                    if (this.damageBool) {
                        this.damageBool = false;
                    }

                    if (r.state == 'left') {
                        r.sprite.animations.play("leftIdle");
                    } else if (r.state == 'leftIdle') {
                        r.sprite.animations.play("leftIdle");
                    } else if (r.state == 'rightIdle') {
                        r.sprite.animations.play("rightIdle");
                    } else if (r.state == 'right') {
                        r.sprite.animations.play("rightIdle");
                    }
                    r.stateTime = this.time.now + 1000;

                }

            }
        }

        for (var i = 0; i < this.drones.length; i++) {
            var d = this.drones[i];

            d.update();


            if (this.checkOverlap(this.player.sprite, d.light)) {
                console.log(178);
                this.screenShake();
                if (d.detectTime > 0) {
                    this.screenShake();

                    d.detectTime -= 20;
                    d.light.animations.frame = 1;
                    d.light.scale.setTo(1 * d.detectTime / 1000, 3 * d.detectTime / 1000)
                    // hidePopUpBool = true;


                    if (d.detectTime <= 0) {
                        d.firingRobotTime = this.time.now + 3000;
                        d.light.scale.setTo(1, 3);
                        d.light.animations.frame = 2;

                    }
                } else {
                    console.log('game over');
                }

            } else {
                d.light.scale.setTo(1, 3);
                d.light.animations.frame = 0;
            }

            if (d.detectTime <= 0) {
                d.light.animations.frame = 2;

                var t = d.firingRobotTime - this.time.now;
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

                    var c = this.add.sprite(d.sprite.x, d.sprite.y, 'capsule');
                    c.animations.frame = 0;
                    this.physics.p2.enable(c);
                    c.body.data.gravityScale = 10;
                    c.body.setCircle(25);
                    if (d.sprite.body.velocity.x > 0) {
                        c.body.velocity.x = 400;
                    } else {
                        c.body.velocity.x = -400;
                    }

                    c.body.setCollisionGroup(this.capsuleCollisionGroup);
                    c.body.collides([this.tilesCollisionGroup, this.playerCollisionGroup]);

                    c.hatchingTime = this.time.now + 10000;

                    this.capsules.push(c);

                    console.log(this.capsules);
                }
            }


        }

        for (var i = 0; i < this.capsules.length; i++) {
            var c = this.capsules[i];

            var t = c.hatchingTime - this.time.now;
            if (t > 400) {
            } else if (t > 300) {
                c.animations.frame = 1;
            } else if (t > 200) {
                c.animations.frame = 1;
            } else if (t > 100) {
                c.animations.frame = 3;
            } else if (t > 0) {
                c.animations.frame = 4;

            } else {
                var r = new Robot(game, c.x, c.y - 400);
                c.destroy();


                r.sprite.body.setCollisionGroup(this.robotCollisionGroup);
                r.sprite.body.collides(this.tilesCollisionGroup);
                this.robots.push(r);

                this.capsules.splice(i, 1); // remove the capsule from the array;
            }
        }


    },
    playerAttackFromLeft: function (r) {
        return this.player.sprite.body.x < r.sprite.x && (r.state == 'right' || r.state == 'rightIdle');
    },
    playerAttackFromRight: function (r) {
        return this.player.sprite.body.x > r.sprite.x && (r.state == 'left' || r.state == 'leftIdle');
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
        this.player.damagedTime = this.time.now + 300;
        console.log(GameScreenConfig.healthPoint);
        GameScreenConfig.healthPoint -= 1;
        if (GameScreenConfig.healthPoint == 0) {
            this.game.state.start('LoseScreen');
        } else if (GameScreenConfig.healthPoint < 2) {
            GameScreenConfig.heart.animations.play("quick");
        } else if (GameScreenConfig.healthPoint < 4) {
            GameScreenConfig.heart.animations.play("normal");
        } else {
            GameScreenConfig.heart.animations.play("slow");
        }

        GameScreenConfig.healthbar.scale.setTo(GameScreenConfig.healthPoint, 1);
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
        this.robots = [];



    },

    initDrones: function () {
        this.drones = [];

        var d1 = Tile.findObjectsByType('d1s', map, 'objectsLayer')[0];
        this.drone1 = new Drone(this.game, d1.x, d1.y);
        this.drone1.sprite.animations.play('idle');
        this.drone1.leftPos = Tile.findObjectsByType('d1l', map, 'objectsLayer')[0];
        this.drone1.rightPos = Tile.findObjectsByType('d1r', map, 'objectsLayer')[0];
        this.drones.push(this.drone1);

        var d2 = Tile.findObjectsByType('d2s', map, 'objectsLayer')[0];
        this.drone2 = new Drone(this.game, d2.x, d2.y);
        this.drone2.sprite.animations.play('idle');
        this.drone2.leftPos = Tile.findObjectsByType('d2l', map, 'objectsLayer')[0];
        this.drone2.rightPos = Tile.findObjectsByType('d2r', map, 'objectsLayer')[0];
        this.drones.push(this.drone2);

        var d3 = Tile.findObjectsByType('d3s', map, 'objectsLayer')[0];
        this.drone3 = new Drone(this.game, d3.x, d3.y);
        this.drone3.sprite.animations.play('idle');
        this.drone3.leftPos = Tile.findObjectsByType('d3l', map, 'objectsLayer')[0];
        this.drone3.rightPos = Tile.findObjectsByType('d3r', map, 'objectsLayer')[0];
        this.drones.push(this.drone3);

        var d4 = Tile.findObjectsByType('d4s', map, 'objectsLayer')[0];
        this.drone4 = new Drone(this.game, d4.x, d4.y);
        this.drone4.sprite.animations.play('idle');
        this.drone4.leftPos = Tile.findObjectsByType('d4l', map, 'objectsLayer')[0];
        this.drone4.rightPos = Tile.findObjectsByType('d4r', map, 'objectsLayer')[0];
        this.drones.push(this.drone4);

        var d5 = Tile.findObjectsByType('d5s', map, 'objectsLayer')[0];
        this.drone5 = new Drone(this.game, d5.x, d5.y);
        this.drone5.sprite.animations.play('idle');
        this.drone5.leftPos = Tile.findObjectsByType('d5l', map, 'objectsLayer')[0];
        this.drone5.rightPos = Tile.findObjectsByType('d5r', map, 'objectsLayer')[0];
        this.drones.push(this.drone5);



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
    initHitboxs: function () {
        // later

    }


}
