

var Robot = function (game, x, y) {

    this.game = game;

    this.sprite = game.add.sprite(x, y, 'robot');
    game.physics.p2.enable(this.sprite, true);

    this.sprite.animations.add('leftIdle', Phaser.Animation.generateFrameNames('il', 1, 22), 10, true);
    this.sprite.animations.add('rightIdle', Phaser.Animation.generateFrameNames('ir', 1, 22), 10, true);
    this.sprite.animations.add('left', Phaser.Animation.generateFrameNames('l', 1, 2), 10, true);
    this.sprite.animations.add('right', Phaser.Animation.generateFrameNames('r', 1, 2), 10, true);
    this.sprite.animations.add('switchOffLeft', Phaser.Animation.generateFrameNames('dl', 1, 4), 10, true);
    this.sprite.animations.add('switchOffRight', Phaser.Animation.generateFrameNames('dr', 1, 4), 10, true);
    this.sprite.animations.add('hackLeft', Phaser.Animation.generateFrameNames('hl', 1, 2), 10, true);
    this.sprite.animations.add('hackRight', Phaser.Animation.generateFrameNames('hr', 1, 2), 10, true);

    this.sprite.animations.play("left");
    this.state = 'left';

    this.sprite.body.clearShapes();

    this.sprite.body.addCircle(24, 0, -76);
    this.sprite.body.addRectangle(59, 90, 0, -8);
    this.sprite.body.addRectangle(155, 55, 0, 67);

    this.sprite.body.fixedRotation = true;

    this.sprite.states = [['left', 'idle'], ['left', 'left'],
    ['right', 'idle'], ['right', 'right'],
    ['idle', 'idle'], ['idle', 'left'], ['idle', 'right']];
    this.state = 'idle';
    this.vulnerable = false;
    this.stateTime = game.time.now;

    // updateRobots: function (game) {
    //     var timeNow = game.time.now;

    //     game.robots.children.forEach(function (r, i, obj) {

    this.update = function () {

        this.sprite.body.velocity.x = 0;

        if (!this.vulnerable) {

            if (this.game.time.now > this.stateTime) {
                if (this.state == "left") {
                    // left -> leftIdle
                    this.state = "leftIdle";
                    this.stateTime = this.game.time.now + 1000;

                } else if (this.state == "right") {
                    // right -> rightIdle
                    this.state = "rightIdle";
                    this.stateTime = this.game.time.now + 1000;

                } else { // this.state == "leftIdle" or this.state == "rightIdle"
                    if (Math.random() < 0.4) {
                        if (this.state == "leftIdle") {
                            // leftIdle -> rightIdle
                            this.state = 'rightIdle';
                            this.stateTime = this.game.time.now + 2000;

                        } else {
                            // rightIdle -> leftIdle
                            this.state = 'leftIdle';
                            this.stateTime = this.game.time.now + 2000;

                        }


                    } else {
                        if (Math.random() < 0.5) {
                            // leftIdle or rightIdle -> left
                            this.state = 'left';
                            this.stateTime = this.game.time.now + 3000;

                        } else {
                            // leftIdle or rightIdle -> right
                            this.state = 'right';
                            this.stateTime = this.game.time.now + 3000;

                        }
                    }
                }


            } else {
                this.sprite.animations.play(this.state);
                if (this.state == 'left') {
                    this.sprite.body.moveLeft(100);
                } else if (this.state == 'right') {
                    this.sprite.body.moveRight(100);
                }

            }

        }
        else {

            if (this.state == 'hackLeft'){
                this.sprite.animations.play('hackLeft');
            }else if (this.state == 'hackRight'){
                this.sprite.animations.play('hackRight');
            }else if (this.state == 'left' || this.stage == 'leftIdle'){
                this.sprite.animations.play('switchOffLeft');
            }
                       // if the robot is attacked, and it is already dead,
            else{
                this.sprite.animations.play('switchOffRight');
            }
        }
    }
}