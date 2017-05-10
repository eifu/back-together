
Arm = function (game, map) {

        this.game = game;
        this.map = map;

        // The player and its settings
        playerStartPos = Tile.findObjectsByType('playerStart', map, 'objectsLayer')
        // playerEndPos = Tile.findObjectsByType('playerEnd', map, 'objectsLayer');
        this.sprite = game.add.sprite(playerStartPos[0].x, playerStartPos[0].y, 'arm');

        //  We need to enable physics on the player
        game.physics.p2.enable(this.sprite, true);

        this.sprite.animations.add('left', Phaser.Animation.generateFrameNames('l', 1, 6), 10, true);
        this.sprite.animations.add('right', Phaser.Animation.generateFrameNames('r', 1, 6), 10, true);
        this.sprite.animations.add('damageL', Phaser.Animation.generateFrameNames('dl', 1, 2), 10, true);
        this.sprite.animations.add('damageR', Phaser.Animation.generateFrameNames('dr', 1, 2), 10, true);


        this.sprite.animations.add('jumpL', Phaser.Animation.generateFrameNames('jl', 0, 14), 10, true);
        this.sprite.animations.add('jumpR', Phaser.Animation.generateFrameNames('jr', 0, 14), 10, true);


        this.sprite.animations.play('right');
        this.sprite.face = 'right';

        this.sprite.body.clearShapes();
        // player.body.addPolygon({}, [[0,54],[128,54],[112,-10],[16,-10]]);
        this.sprite.body.addRectangle(140, 20, 0, 35);
        this.sprite.body.addRectangle(128, 50, 0, 20);
        this.sprite.body.addRectangle(100, 70, 0, 5);
        this.sprite.body.addRectangle(80, 100, 0, -10);


        game.camera.follow(this.sprite);

        this.damaged = false;
        this.damagedTime = 0;

        // player.items = ['invisible', 'stink', 'invisible'];
        this.items = { 'invisible': 2, 'stink': 1 };
        this.itemBtns = [];
        this.itemNums = [];


        this.isJumping = false;

        this.update = function () {


                this.sprite.body.velocity.x = 0;


                var timeNow = this.game.time.now;
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
                        if (keys['LEFT'].isDown || keys['A'].isDown) {


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
                        else if (keys['RIGHT'].isDown || keys['D'].isDown) {

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
                        else if (keys['UP'].isDown || keys['W'].isDown) {


                                if (!this.isJumping) {
                                        if (this.face == 'left') {
                                                this.sprite.animations.play('jumpL');
                                                 this.sprite.body.moveLeft(500);
                                        } else {
                                                this.sprite.animations.play('jumpR');
                                                this.sprite.body.moveRight(500)
                                        }

                                        this.sprite.body.velocity.y = -700;

                                       console.log(this.sprite.body.velocity.x);
                                        // this.UPinput = true;

                                        GameScreenConfig.setObjective('↑ is for Jump! Torso can jump!')

                                        this.isJumping = true;
                                }

                                GameScreenConfig.setObjective('↑ is for back flip. You use it when you are upside-down!')
                                

                        }
                        else if (keys['DOWN'].isDown || keys['S'].isDown) {

                                this.downInput = true;
                                // this.hackingStart = true;
                                // this.hackingEntTime = this.game.time.now + 5000;

                                // this.sprite.body.alpha = 0.2;

                                // // console.log(this.sprite.body.data.gravityScale);
                                // this.sprite.body.data.gravityScale = 0;


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
                                        this.sprite.animations.stop();

                                }
                                GameScreenConfig.setObjective();
                        }


                }
        }
}