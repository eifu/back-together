
var Hand = function (game, map) {

    this.game = game;
    this.map = map;

    // The player and its settings
    playerStartPos = Tile.findObjectsByType('playerStart', map, 'objectsLayer')
    this.sprite = game.add.sprite(playerStartPos[0].x, playerStartPos[0].y, 'hand');

    //  We need to enable physics on the player
    game.physics.p2.enable(this.sprite, true);

    this.sprite.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 5), 10, true);
    this.sprite.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 5), 10, true);
    this.sprite.animations.add('damageL', Phaser.Animation.generateFrameNames('damageL', 1, 4), 10, true);
    this.sprite.animations.add('damageR', Phaser.Animation.generateFrameNames('damageR', 1, 4), 10, true);
    this.sprite.animations.add('flipL', Phaser.Animation.generateFrameNames('flipL', 1, 3), 10, true);
    this.sprite.animations.add('flipR', Phaser.Animation.generateFrameNames('flipR', 1, 3), 10, true);
    this.sprite.animations.add('dying', Phaser.Animation.generateFrameNames('dying', 1, 6), 10, true);
    this.sprite.animations.add('die', Phaser.Animation.generateFrameNames('die', 1, 6), 10, true);


    this.sprite.animations.play('right');
    this.face = 'right';

    // this.sprite.scale.setTo(0.5,0.5);
    this.sprite.body.clearShapes();
    // this.sprite.body.addPolygon({}, [[1, 42], [1, 29], [32, 20], [63, 29], [63, 42]]);
    this.sprite.body.addRectangle(64, 24, 0, 0);


    this.sprite.body.addCapsule(-16, 4, 0, 5, 0);
    this.sprite.body.addCapsule(-16, 4, 0, 5, 0);
    this.sprite.body.addCapsule(-16, 4, 0, 5, 0);
    this.sprite.body.adjustCenterOfMass()

    game.camera.follow(this.sprite);

    this.damaged = false;
    this.damagedTime = 0;

    this.hackingStart = false;
    this.hackingEntTime = 0;

    // player.items = ['invisible', 'stink', 'invisible'];
    this.items = { 'invisible': 2, 'stink': 1 };
    this.itemBtns = [];
    this.itemNums = [];


    this.hackedRobot = null;


    this.update = function () {


        var timeNow = this.game.time.now;

        //  Reset the players velocity (movement)
        this.sprite.body.velocity.x = 0;
        if (timeNow < this.hackingEndTime) {
            // this.sprite.body.data.gravityScale = 0;
            // this.sprite.body.clearShapes();
            this.game.camera.follow(this.hackedRobot.sprite);

        } else if (this.hackingStart == true) {
            this.game.camera.follow(this.sprite);
            console.log('hacking finished');
            this.sprite.body.data.gravityScale = 1;
            this.sprite.body.x = this.hackedRobot.sprite.body.x;
            this.sprite.body.y = this.hackedRobot.sprite.body.y;
            this.hackingStart = false;
            this.addShape();
            this.sprite.visible = true;
            if (this.hackedRobot.sprite.animations.name == 'hackLeft'){
                this.hackedRobot.state = 'switchOffLeft';
                this.hackedRobot.sprite.animations.play('switchOffLeft');
                console.log('76')
            }else {
                this.hackedRobot.state = 'switchOffRight';
                this.hackedRobot.sprite.animations.play('switchOffRight');
                console.log(79);
            }
        }


        if (timeNow < this.damagedTime) {
            // if player gets damaged.
            // console.log(48);
            // console.log(timeNow);
            // console.log(this.damagedTime);
            if (this.face == 'left') {
                this.sprite.animations.play('damageL')
                this.sprite.body.velocity.x = 500;  // player moves back
            } else {
                this.sprite.animations.play("damageR")
                this.sprite.body.velocity.x = -500;  // player moves back
            }

            GameScreenConfig.setObjective("Damaged!! You can't move (>_<)")


        } else {
            // if player does not get damaged. 

            if (keys['LEFT'].isDown || keys['A'].isDown) {

                if (this.hackingStart) {

                    console.log('left hack');

                    console.log(this.hackedRobot);
                    this.sprite.body.moveLeft(100);
                    this.hackedRobot.sprite.body.x = this.sprite.x;

                    this.hackedRobot.sprite.animations.play('hackLeft');
                    this.hackedRobot.state = 'hackLeft';
                    GameScreenConfig.setObjective("hacking now!! going left!!");


                } else {
                    //  Move to the left
                    if (this.sprite.animations.frame == 0) {
                        this.sprite.body.velocity.x = -600;
                    } else if (this.sprite.animations.frame == 1) {
                        this.sprite.body.velocity.x = -800;
                    } else if (this.sprite.animations.frame == 2) {
                        this.sprite.body.velocity.x = -600;
                    } else {
                        this.sprite.body.velocity.x = -400;
                    }
                    this.sprite.animations.play('left');
                    this.face = 'left';

                    GameScreenConfig.setObjective("<--- Moving Left, goint wrong way");

                }
            }
            else if (keys['RIGHT'].isDown || keys['D'].isDown) {

                if (this.hackingStart) {
                    console.log('right hack');
                    console.log(this.hackedRobot);
                    this.sprite.body.moveRight(100);
                    this.hackedRobot.sprite.body.x = this.sprite.x;
                    this.hackedRobot.sprite.animations.play('hackRight');
                    this.hackedRobot.state = 'hackRight';
                    GameScreenConfig.setObjective("hacking now! moving Right!!");
                }
                else {
                    //  Move to the right
                    if (this.sprite.animations.frame == 4) {
                        this.sprite.body.velocity.x = 600;
                    } else if (this.sprite.animations.frame == 5) {
                        this.sprite.body.velocity.x = 800;
                    } else if (this.sprite.animations.frame == 6) {
                        this.sprite.body.velocity.x = 600;
                    } else {
                        this.sprite.body.velocity.x = 400;
                    }
                    this.sprite.animations.play('right');
                    this.face = 'right';


                    GameScreenConfig.setObjective("Moving R I G H T ---> Hurry up!!");

                }

            }
            else if (keys['UP'].isDown || keys['W'].isDown) {

                if (this.hackingStart) {
                    // this.sprite.body.moveUp(100);
                    this.hackedRobot.sprite.body.velocity.y = -400;
                    this.sprite.body.y = this.hackedRobot.sprite.y - 150;

                    GameScreenConfig.setObjective("hacking now! moving UP↑↑↑!!");
                }
                else {
                    if (this.sprite.body.angle > 100 || this.sprite.body.angle < -100) {
                        // the player is flipped.

                        this.sprite.body.velocity.y = -400;
                        this.sprite.body.angle += 180;
                        if (this.face == 'left') {
                            this.sprite.animations.play('flipL');
                            this.sprite.body.velocity.x = 200;
                        } else {
                            this.sprite.animations.play('flipR');
                            this.sprite.body.velocity.x = -200;
                        }
                        console.log(179);
                        console.log(this.sprite.animations);

                    }
                    else {

                        GameScreenConfig.setObjective('↑ is for back flip. You use it when you are upside-down!')
                    }
                }
            }
            else if (keys['DOWN'].isDown || keys['S'].isDown) {
                if (this.hackingStart) {
                    // this.sprite.body.moveDown(100);
                    this.sprite.body.y = this.hackedRobot.sprite.y - 150;
                    GameScreenConfig.setObjective("hacking now! moving DOWN↓↓↓!!");
                }
                else {
                    this.downInput = true;
                    // this.hackingStart = true;
                    // this.hackingEntTime = this.game.time.now + 5000;

                    // this.sprite.body.alpha = 0.2;

                    // // console.log(this.sprite.body.data.gravityScale);
                    // this.sprite.body.data.gravityScale = 0;
                }

            }

            else {

                if (this.damaged) {
                    if (this.face == 'left') {
                        this.sprite.animations.play('left');
                    } else {
                        this.sprite.animations.play('right');
                    }
                    this.damaged = false;

                } else {
                    if (this.sprite.animations.name == 'flipL') {
                        this.sprite.animations.play('left');
                    } else if (this.sprite.animations.name == 'flipR') {
                        this.sprite.animations.play('right');
                    } else {
                        this.sprite.animations.stop();
                    }



                }
                GameScreenConfig.setObjective();
            }
        }
    }

    this.addShape = function () {
        this.sprite.body.addRectangle(64, 24, 0, 0);
        this.sprite.body.addCapsule(-16, 4, 0, 5, 0);
        this.sprite.body.addCapsule(-32, 4, 0, 5, 0);
        this.sprite.body.addCapsule(-16, 4, 0, 5, 0);
        this.sprite.body.adjustCenterOfMass()

        this.sprite.body.setCollisionGroup(this.myCG);
        this.sprite.body.collides(this.tileCG);

    }
}


