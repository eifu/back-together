

var Drone = function (game, x, y) {

    this.game = game;

    this.sprite = game.add.sprite(x, y, 'drone');

    this.detectTime = 1000;

    game.physics.p2.enable(this.sprite, true);
    this.sprite.animations.add('left', [0, 1], 10, true);
    this.sprite.animations.add('left_damaged', [2, 3], 10, true)
    this.sprite.animations.add('right', [4, 5], 10, true);
    this.sprite.animations.add("right_damaged", [6, 7], 10, true);
    this.sprite.animations.add('idle', [0, 1, 0, 1, 0, 1, 4, 5, 4, 5, 4, 5], 10, true);

    this.lightShadow = game.add.sprite(x, y + 30, 'droneLight');
    game.physics.p2.enable(this.lightShadow, true);
    this.lightShadow.body.data.gravityScale = 0;
    this.lightShadow.anchor.setTo(0.5, 0);
    this.lightShadow.scale.setTo(1, 3);
    this.lightShadow.animations.frame = 0;
    this.lightShadow.body.clearShapes();
    this.lightShadow.sendToBack();
    this.game.world.bringToTop(this.lightShadow);

    this.light = game.add.sprite(x, y + 30, 'droneLight');
    game.physics.p2.enable(this.light, true);
    this.light.body.data.gravityScale = 0;
    this.light.anchor.setTo(0.5, 0);
    this.light.scale.setTo(1, 3);
    this.light.animations.frame = 0;
    this.light.body.clearShapes();
    this.light.sendToBack();
    this.game.world.bringToTop(this.light);


    this.firingRobotCounting1Text = game.add.text(x, y + 200, '1', { font: '64px Aclonica', fill: '#B71C1C' });
    this.firingRobotCounting1Text.visible = false;
    this.firingRobotCounting1Text.scale.setTo(3, 3);
    this.firingRobotCounting1Text.anchor.setTo(0.5, 0.5);
    this.game.world.bringToTop(this.firingRobotCounting1Text);


    this.firingRobotCounting2Text = game.add.text(x, y + 300, '2', { font: '64px Aclonica', fill: '#B71C1C' });
    this.firingRobotCounting2Text.visible = false;
    this.firingRobotCounting2Text.scale.setTo(3, 3);
    this.firingRobotCounting2Text.anchor.setTo(0.5, 0.5);
    this.game.world.bringToTop(this.firingRobotCounting2Text);


    this.firingRobotCounting3Text = game.add.text(x, y + 400, '3', { font: '64px Aclonica', fill: '#B71C1C' });
    this.firingRobotCounting3Text.visible = false;
    this.firingRobotCounting3Text.scale.setTo(3, 3);
    this.firingRobotCounting3Text.anchor.setTo(0.5, 0.5);
    this.game.world.bringToTop(this.firingRobotCounting3Text);



    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.body.clearShapes();
    this.sprite.animations.play("left");
    this.face = 'left';

    // d.body.mass = 0;
    this.sprite.body.data.gravityScale = 0;
    this.state = 'patrol';
    this.stateTime = 0;

    this.update = function () {

        this.sprite.body.velocity.x = 0;

        if (this.state == 'patrol') {
            // goomba
            // console.log(d.rightPos[0].x);
            if (this.sprite.body.x < this.leftPos.x) {
                this.face = 'right';
                this.sprite.body.moveRight(100);
                this.light.body.moveRight(100);
                this.lightShadow.body.moveRight(100);
                this.firingRobotCounting1Text.x = this.sprite.body.x;
                this.firingRobotCounting2Text.x = this.sprite.body.x;
                this.firingRobotCounting3Text.x = this.sprite.body.x;

            } else if (this.leftPos.x <= this.sprite.body.x && this.sprite.body.x <= this.rightPos.x) {

                if (this.face == "left") {

                    this.sprite.body.moveLeft(100);
                    this.light.body.moveLeft(100);
                    this.lightShadow.body.moveLeft(100);
                    this.firingRobotCounting1Text.x = this.sprite.body.x;
                    this.firingRobotCounting2Text.x = this.sprite.body.x;
                    this.firingRobotCounting3Text.x = this.sprite.body.x;

                    this.sprite.animations.play('left');


                } else {
                    this.sprite.body.moveRight(100);
                    this.light.body.moveRight(100);
                    this.lightShadow.body.moveRight(100);
                    this.firingRobotCounting1Text.x = this.sprite.body.x;
                    this.firingRobotCounting2Text.x = this.sprite.body.x;
                    this.firingRobotCounting3Text.x = this.sprite.body

                    this.sprite.animations.play('right');

                }
            }

            else {
                this.face = 'left';

                this.sprite.body.moveLeft(100);
                this.light.body.moveLeft(100);
                this.lightShadow.body.moveLeft(100);
                this.firingRobotCounting1Text.x = this.sprite.body.x;
                this.firingRobotCounting2Text.x = this.sprite.body.x;
                this.firingRobotCounting3Text.x = this.sprite.body.x;

            }

        } else {
            if (this.game.time.now < this.stateTime) {
                if (this.state == 'on') {
                    this.light.visible = true;
                    this.lightShadow.visible = true;
                } else {
                    // of 
                    this.light.visible = false;
                    this.lightShadow.visible = false;

                }

            } else {
                if (this.detectTime <= 0) {
                    this.stateTime = this.game.time.now + 5000;
                }
                else {
                    if (this.state == 'on') {
                        this.state = 'off';
                        this.stateTime = this.game.time.now + 5000;
                        console.log(142);

                        this.light.visible = false;
                        this.lightShadow.visible = false;
                        this.firingRobotCounting1Text.visible = false;
                        this.firingRobotCounting3Text.visible = false;
                        this.firingRobotCounting3Text.visible = false;
                        this.detectTime = 1000;

                    } else {
                        // off 
                        this.state = 'on';
                        this.stateTime = this.game.time.now + 5000;
                    }
                }

            }
        }
    }

    this.setOnOffMode = function () {
        this.state = 'on';
    }
}