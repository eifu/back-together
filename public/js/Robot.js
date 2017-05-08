

var Robot= {
    factoryRobot: function (game, x, y) {
        var r = game.robots.create(x, y, 'robot');
        game.physics.p2.enable(r, true);

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
        r.vulnerable = false;
        r.stateTime = game.time.now;
        return r;
    },
    updateRobots: function (game) {
        var timeNow = game.time.now;

        game.robots.children.forEach(function (r, i, obj) {
            if (!r.vulnerable) {

                if (timeNow > r.stateTime) {
                    if (r.state == "left") {
                        // left -> leftIdle
                        r.state = "leftIdle";
                        r.stateTime = timeNow + 3000;

                    } else if (r.state == "right") {
                        // right -> rightIdle
                        r.state = "rightIdle";
                        r.stateTime = timeNow + 3000;

                    } else { // r.state == "leftIdle" or r.state == "rightIdle"
                        if (Math.random() < 0.9) {
                            if (r.state == "leftIdle") {
                                // leftIdle -> rightIdle
                                r.state = 'rightIdle';
                                r.stateTime = timeNow + 2000;

                            } else {
                                // rightIdle -> leftIdle
                                r.state = 'leftIdle';
                                r.stateTime = timeNow + 2000;

                            }


                        } else {
                            if (Math.random() < 0.5) {
                                // leftIdle or rightIdle -> left
                                r.state = 'left';
                                r.stateTime = timeNow + 3000;

                            } else {
                                // leftIdle or rightIdle -> right
                                r.state = 'right';
                                r.stateTime = timeNow + 3000;

                            }
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
}