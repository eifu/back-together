
var Hand = function (game) {

    this.game = game;

    // The player and its settings
    playerStartPos = Tile.findObjectsByType('playerStart', map, 'objectsLayer')
    playerEndPos = Tile.findObjectsByType('playerEnd', map, 'objectsLayer');
    this.sprite = game.add.sprite(playerStartPos[0].x, playerStartPos[0].y, 'hand');

    //  We need to enable physics on the player
    game.physics.p2.enable(this.sprite, true);

    this.sprite.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 5), 10, true);
    this.sprite.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 5), 10, true);
    this.sprite.animations.add('left_damaged', Phaser.Animation.generateFrameNames('left_damaged', 1, 2), 10, true);
    this.sprite.animations.add('right_damaged', Phaser.Animation.generateFrameNames('right_damaged', 1, 2), 10, true);


    this.sprite.animations.play('left');
    this.face = 'left';

    this.sprite.body.clearShapes();
    this.sprite.body.addPolygon({}, [[1, 42], [1, 29], [32, 20], [63, 29], [63, 42]]);


    game.camera.follow(this.sprite);

    this.damaged = false;
    this.damagedTime = 0;

    // player.items = ['invisible', 'stink', 'invisible'];
    this.items = { 'invisible': 2, 'stink': 1 };
    this.itemBtns = [];
    this.itemNums = [];


    this.update = function () {


        var timeNow = this.game.time.now;

        //  Reset the players velocity (movement)
        this.sprite.body.velocity.x = 0;

        if (timeNow < this.damagedTime) {
            // if player gets damaged.
            if (this.face == 'left') {
                this.sprite.animations.play('left_damaged')
                this.sprite.body.velocity.x = 100;  // player moves back
            } else {
                this.sprite.animations.play("right_damaged")
                this.sprite.body.velocity.x = -100;  // player moves back
            }


        } else {
            // if player does not get damaged. 

            if (keys['LEFT'].isDown || keys['A'].isDown) {
                console.log(54);
                console.log(timeNow);

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
            } else {

                if (this.damaged) {
                    if (this.face == 'left') {
                        this.sprite.animations.frame = 0
                    } else {
                        this.sprite.animations.frame = 4
                    }
                } else {
                    this.sprite.animations.stop();

                }
            }
        }
    }
}


