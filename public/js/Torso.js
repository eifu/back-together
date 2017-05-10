
Torso = function (game, map) {

        this.game = game;
        this.map = map;

        // The player and its settings
        playerStartPos = Tile.findObjectsByType('playerStart', map, 'objectsLayer')
        // playerEndPos = Tile.findObjectsByType('playerEnd', map, 'objectsLayer');
        this.sprite = game.add.sprite(playerStartPos[0].x, playerStartPos[0].y, 'torso');

        //  We need to enable physics on the player
        game.physics.p2.enable(this.sprite, false);

        this.sprite.animations.add('left', Phaser.Animation.generateFrameNames('l', 1, 4), 10, true);
        this.sprite.animations.add('right', Phaser.Animation.generateFrameNames('r', 1, 4), 10, true);
        this.sprite.animations.add('jumpL', Phaser.Animation.generateFrameNames('jumpL', 1, 2), 10, true);
        this.sprite.animations.add('jumpR', Phaser.Animation.generateFrameNames('jumpR', 1, 2), 10, true);
        this.sprite.animations.add('die', Phaser.Animation.generateFrameNames('die', 1, 4), 10, true);


        this.sprite.animations.play('right');
        this.sprite.face = 'right';
        
        this.sprite.body.fixedRotation = true;

        this.sprite.body.clearShapes();
        // player.body.addPolygon({}, [[0,54],[128,54],[112,-10],[16,-10]]);
        this.sprite.body.addRectangle(200, 50, 0, 45);
        this.sprite.body.addRectangle(168, 50, 0, 20);
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


                



                var timeNow = this.game.time.now;
                if (this.isJumping){

                }

                else if (timeNow < this.damagedTime) {
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
                        this.sprite.body.velocity.x = 0;
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
                                console.log(109);
                                console.log(this.sprite.body.velocity.y);

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

                        }
                        else if (keys['DOWN'].isDown || keys['S'].isDown) {

                                this.downInput = true;


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
                                        if (this.sprite.animations.name == 'jumpL'){
                                                this.sprite.animations.play('left');
                                        }else if (this.sprite.animations.name == 'jumpR'){
                                                this.sprite.animations.play('right');
                                        }
                                        this.sprite.animations.stop();

                                }
                                GameScreenConfig.setObjective();
                        }


                }
        }
}