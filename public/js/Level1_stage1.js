BackTogether.Level1_stage1 = function (game) {

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
var invisBar;

BackTogether.Level1_stage1.prototype = {

    create: function (game) {
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0;
        WebFont.load(wfconfig);
        this.stage.backgroundColor = "#3A5963";
        map = this.add.tilemap('level1_stage1', 64, 64);
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
        }

        this.player.sprite.enableBody = true;
        this.player.sprite.body.setCollisionGroup(this.playerCollisionGroup);
        this.player.sprite.body.collides([this.tilesCollisionGroup, this.capsuleCollisionGroup]);

        // these are general purpose.
        GameScreenConfig.initText(game);
        GameScreenConfig.initHealthBar(game);
        GameScreenConfig.initVolIcon(game);
        GameScreenConfig.initObjective(game, 'Get familiar with User Controll!');
        
        // init the "progress bar" of the item you're planning to put into current stage of current level
        GameScreenConfig.initBar(game, 'bar');
        
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

        this.intro0Bool = true;
        this.intro0_2Bool = false;
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

            if (this.checkOverlap(this.player.sprite, r.sprite) && !this.currentlyInvisible) {
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

                if (!r.vulnerable && !this.player.damaged) {
                    this.screenShake();
                    this.playerDamaged();

                    if (this.damageBool) {
                        this.popupScreen.setText("Watch out!\n You have to walk up to its back!!\n The life point get reduced,\n and you lose the game!!");
                        this.popupScreen.on();
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

            if (d.state == 'on') {

                if (this.checkOverlap(this.player.sprite, d.light) && !this.currentlyInvisible) {
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

        }

        for (var i = 0; i < this.capsules.length; i++) {
            var c = this.capsules[i];

            var t = c.hatchingTime - this.time.now;
            if (t > 400) {
            } else if (t > 300) {
                c.animations.frame = 1;
            } else if (t > 200) {
                c.animations.frame = 2;
            } else if (t > 100) {
                c.animations.frame = 3;
            } else if (t > 0) {
                c.animations.frame = 4;

            } else {
                var r = new Robot(game, c.x, c.y - 200);
                c.destroy();


                r.sprite.body.setCollisionGroup(this.robotCollisionGroup);
                r.sprite.body.collides(this.tilesCollisionGroup);
                this.robots.push(r);

                this.capsules.splice(i, 1); // remove the capsule from the array;
            }
        }

        if (this.intro0_2Bool) {
            this.popupScreen.setText("Controls are WASD or arrow keys.\n  A/← is for moving left,\n D/→ is for moving right,\n W/↑ is for flipping back over\n when you fall over backwards.");
            this.popupScreen.on();
            this.intro0_2Bool = false;
        }

        if (this.intro0Bool) {
            this.intro0_2Bool = true;
            this.intro0Bool = false;
        }
        
        if(!this.currentlyInvisible){

        if (this.intro1Bool && this.checkOverlap(this.player.sprite, this.intro1)) {
            this.popupScreen.setText("Space to pause/unpause game");
            this.popupScreen.on();
            this.intro1.destroy();
            this.intro1Bool = false;
        }

        if (this.intro3_2Bool) {
            this.popupScreen.setText("When the robot is turned away\n from you, you can walk up to\n its back and tap against it\n to trigger shutdown.");
            this.popupScreen.on();
            this.intro3_2Bool = false;
        }
        if (this.intro3Bool && this.checkOverlap(this.player.sprite, this.intro3)) {
            this.popupScreen.setText("It's an evil robot.\n But don't worry, you're safe for now.\n ");
            this.popupScreen.on();
            this.intro3.destroy();
            this.intro3Bool = false;
            this.intro3_2Bool = true;
        }

        if (this.intro4_2Bool) {
            this.popupScreen.setText("Once it finds you, you can hide \n to get away");
            this.popupScreen.on();
            this.intro4_2Bool = false;
        }

        if (this.intro4Bool && this.checkOverlap(this.player.sprite, this.intro4)) {
            this.popupScreen.setText("It's a drone on the look-out for you.\n Air drones will fly around seeking you.");
            this.popupScreen.on();
            this.intro4.destroy();
            this.intro4Bool = false;

            this.intro4_2Bool = true;
        }

        if (this.checkOverlap(this.player.sprite, this.goal)) {
            this.popupScreen.setText("Congratulation!! \nYou just finish\n the first stage of Back together!!");
            this.popupScreen.on();

            user.setStage(2);

            this.game.state.start('Level1_stage2');
        }
        }

        // this.playerVictory();
        // Robot.updateRobots(game);

        // this.collectItem(this.itemBox, game);
        this.enableItem(game, itemSelected);
        this.decrementCoolDowns();
    },
    enableItem: function(game, item){
      if(item == "invisible"){
          this.currentlyInvisible = true;
          this.invisCoolDown = GameScreenConfig.difficultyNum;
          GameScreenConfig.initBarIcon(game, "invisible");
          itemSelected = "x";
      }  
    },
    decrementCoolDowns: function(){
      if(this.invisCoolDown > 0){
          this.invisCoolDown = this.invisCoolDown - .0166;
          GameScreenConfig.updateBar(this.invisCoolDown);
          this.player.sprite.alpha = 0.1;
      }
      else if(this.invisCoolDown <= 0){
          this.invisCoolDown = 0;
          this.currentlyInvisible = false;
          this.player.sprite.alpha = 1;
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
        this.player.damagedTime = this.time.now + 500;
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

        var r1 = Tile.findObjectsByType('r', map, 'objectsLayer')[0];

        console.log(216);
        this.robot1 = new Robot(this.game, r1.x, r1.y);
        this.robot1.sprite.animations.play('leftIdle');
        this.robot1.sprite.body.setCollisionGroup(this.robotCollisionGroup);
        this.robot1.sprite.body.collides(this.tilesCollisionGroup);
        this.robots.push(this.robot1);


    },

    initDrones: function () {
        this.drones = [];

        var d1 = Tile.findObjectsByType('d', map, 'objectsLayer')[0];
        this.drone1 = new Drone(this.game, d1.x, d1.y);
        this.drone1.sprite.animations.play('idle');

        this.drone1.setOnOffMode();

        this.drones.push(this.drone1);



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
        var intro1 = Tile.findObjectsByType('intro1', map, 'objectsLayer')[0];

        this.intro1 = this.add.sprite(intro1.x, intro1.y, 'hitBox');
        this.intro1.anchor.setTo(0.5, 0.5);
        this.intro1.animations.add('normal', [0, 1, 2, 3, 4], 10, true);
        this.intro1.animations.play('normal');

        var intro3 = Tile.findObjectsByType('intro3', map, 'objectsLayer')[0];
        this.intro3 = this.add.sprite(intro3.x, intro3.y, 'hitBox');
        this.intro3.anchor.setTo(0.5, 0.5);
        this.intro3.animations.add('normal', [0, 1, 2, 3, 4], 10, true);
        this.intro3.animations.play('normal');


        var intro4 = Tile.findObjectsByType('intro4', map, 'objectsLayer')[0];
        this.intro4 = this.add.sprite(intro4.x, intro4.y, 'hitBox');
        this.intro4.anchor.setTo(0.5, 0.5);
        this.intro4.animations.add('normal', [0, 1, 2, 3, 4], 10, true);
        this.intro4.animations.play('normal');


        var goalPos = Tile.findObjectsByType('playerGoal', map, 'objectsLayer')[0];
        this.goal = this.add.sprite(goalPos.x, goalPos.y, 'goal');
        this.goal.anchor.setTo(0, 1);
    }


}
