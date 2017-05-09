BackTogether.Level1_stage3 = function (game) {

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

BackTogether.Level1_stage3.prototype = {

    create: function (game) {
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0;
        WebFont.load(wfconfig);
        this.stage.backgroundColor = "#3A5963";
        map = this.add.tilemap('level1_stage3', 64, 64);
        map.addTilesetImage('tileset2');
        map.addTilesetImage('tileset3');

        platformLayer = map.createLayer('platformLayer');
        platformLayer.resizeWorld();


        game.physics.p2.setBoundsToWorld()

        game.physics.p2.convertTilemap(map, platformLayer);

        game.physics.p2.gravity.y = 800;

        // can be Hand, Arm, Torso.
        this.player = new Hand(game, map);
        this.pausedScreen = new PausedScreen(game, this.player);
        this.pausedScreen.off();

        this.popupScreen = new PopupScreen(game, 'Objective: \n Stage 3 REVENGE!\n let\'s try hacking!\n They find you and send robots to you.');


        var collisionObjects = game.physics.p2.convertCollisionObjects(map, 'collision', true);

        this.tilesCollisionGroup = game.physics.p2.createCollisionGroup();
        this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
        this.robotCollisionGroup = game.physics.p2.createCollisionGroup();

        game.physics.p2.updateBoundsCollisionGroup();

        for (var i = 0; i < collisionObjects.length; i++) {


            collisionObjects[i].setCollisionGroup(this.tilesCollisionGroup);
            collisionObjects[i].collides([this.playerCollisionGroup, this.robotCollisionGroup]);


            console.log(collisionObjects[i]);
        }

        this.player.sprite.enableBody = true;

        this.player.sprite.body.setCollisionGroup(this.playerCollisionGroup);
        this.player.sprite.body.collides(this.tilesCollisionGroup);

        this.player.myCG = this.playerCollisionGroup;
        this.player.tileCG = this.tilesCollisionGroup;


        // these are general purpose.
        GameScreenConfig.initText(game);
        GameScreenConfig.initHealthBar(game);
        GameScreenConfig.initVolIcon(game);
        GameScreenConfig.initObjective(game, 'let\'s try hacking!');
        this.initKeys();
        this.initRobots();
        // this.initItemBox();

        this.gameItems = [];
        this.gameItems.push('invisible');
        this.gameItems.push('stink');

        keys['SPACE'].onDown.add(this.unpause, this);
        keys['ENTER'].onDown.add(this.unpause, this);



        this.popupScreen.on();

        this.introBool1 = false;

    },

    update: function (game) {

        if (this.introBool1_2) {
            this.popupScreen.setText("To move robot, \n keep pressing 'S'/↓ with left and right! ");
            this.popupScreen.on();

            this.introBool1_2 = false;
        }

        if (this.introBool1) {
            this.popupScreen.setText("You can disguise as a robot. Yay!");
            this.popupScreen.on();

            this.introBool1 = false;
            this.introBool1_2 = true;
        }

        this.player.update();

        if (keys['SPACE'].isDown || keys['ENTER'].isDown) {
            this.pausedScreen.on();
        }



        for (var i = 0; i < this.robots.length; i++) {

            var r = this.robots[i];

            r.update();
            

            if (this.checkOverlap(this.player.sprite, r.sprite)) {
                // if the player and a robot overlap, 


                if (r.vulnerable) {
                    if (r.state != 'hackLeft' && r.state != 'hackRight') {
                        GameScreenConfig.setObjective("Press down or 'S' to H A C K!");
                    }
                    if (this.player.downInput) {

                        this.player.sprite.body.y = r.sprite.y - 150;
                        this.player.hackingStart = true;
                        this.player.hackingEndTime = this.time.now + 5000;
                        // this.player.sprite.body.data.gravityScale = 0;

                        this.player.hackedRobot = r;

                        this.player.sprite.body.data.gravityScale = 0;
                        this.player.sprite.body.clearShapes();


                        console.log('yeahhhh');

                        if (r.state == 'switchOffLeft') {
                            r.state = 'hackLeft'
                            r.sprite.animations.play('hackLeft');
                        } else {
                            r.state = 'hackRight';
                            r.sprite.animations.play('hackRight');

                        }

                        this.popupScreen.setText("H A C K E D!!\n Now you know how to hack robots!\n");
                        this.popupScreen.on();

                        this.introBool1 = true;
                        this.player.downInput = false;

                    }


                } else {

                    if (this.playerAttackFromLeft(r)) {
                        r.vulnerable = true;
                        this.popupScreen.setText("Good job!\n Let's Hack this broken robot! \n Press down cursor or\n press 'S' next to robot!");
                        this.popupScreen.on();
                    }
                    else if (this.playerAttackFromRight(r)) {
                        r.vulnerable = true;
                        this.popupScreen.setText("Good job!\n Let's Hack this broken robot! \n Press down cursor or\n press 'S' next to robot!");
                        this.popupScreen.on();
                    }

                    if (!this.player.damaged) {
                        this.screenShake();
                        this.playerDamaged();

                        if (r.state == 'left') {
                            r.sprite.animations.play("leftIdle");
                        } else {
                            r.sprite.animations.play("rightIdle");
                        }
                        r.stateTime = 0;

                    }
                }

            }
        }


        // this.playerVictory();
        // Robot.updateRobots(game);

        // this.collectItem(this.itemBox, game);
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
        // this.game.robots = this.add.group();
        this.robots = [];

        _robot1Start = Tile.findObjectsByType('robot1Start', map, 'objectsLayer');

        console.log(216);
        var robot1 = new Robot(this.game, _robot1Start[0].x, _robot1Start[0].y);
        robot1.sprite.body.setCollisionGroup(this.robotCollisionGroup);
        robot1.sprite.body.collides(this.tilesCollisionGroup);

        this.robots.push(robot1);

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

                this.pausedScreen.confirmOff();
                console.log(565);

            } else if (this.pausedScreen.pauseBool) {

                console.log(573);
                this.pausedScreen.off();

            }
        }
    },


}
