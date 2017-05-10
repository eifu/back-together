BackTogether.LevelSelecting = function (game) {

};

//
//  user info. should be Player.js that handles the data.
// 



//
var volDownIcon;
var Level;
var wfconfig = {
    google: {
        families: ['Aclonica']
    }
};

var menuLayer;
var levelShowing = 1;
var itoaArray;

BackTogether.LevelSelecting.prototype = {
    create: function (game) {

        var inputs = [
            Phaser.Keyboard.ONE,
            Phaser.Keyboard.TWO,
            Phaser.Keyboard.THREE,
            Phaser.Keyboard.FOUR,
            Phaser.Keyboard.FIVE,
            Phaser.Keyboard.SIX,
            Phaser.Keyboard.SEVEN,
            Phaser.Keyboard.EIGHT,
            Phaser.Keyboard.NINE,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR,
            Phaser.Keyboard.W,
            Phaser.Keyboard.A,
            Phaser.Keyboard.S,
            Phaser.Keyboard.D,
            Phaser.Keyboard.O,
            Phaser.Keyboard.P
        ];
        var name = [
            'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'UP', 'LEFT', 'RIGHT', 'DOWN', 'SPACE', 'W', 'A', 'S', 'D', 'O', 'P'
        ]

        keys = {};
        inputs.forEach(function (input, i) {
            keys[name[i]] = game.input.keyboard.addKey(input);
        });





        WebFont.load(wfconfig);
        game.stage.backgroundColor = "#570e28";


        var l = game.add.sprite(this.camera.view.centerX, this.camera.view.centerY + 60, 'logo');
        l.anchor.setTo(0.5, 0.5);

        var txt = game.add.text(this.camera.view.centerX, 50, "SELECT YOUR LEVEL", {
            font: '60px Aclonica', fill: "#000",
            align: "center"
        });

        txt.anchor.setTo(0.5, 0.5);


        itoaArray = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN',
            'ELEVEN', 'TWELVE']

        this.buttons = [];
        for (var x = 0; x < 3; x++) {
            this.buttons.push(this.createButton(game, levelShowing, x,
                this.camera.view.centerX + (x - 1) * 250, this.camera.view.centerY, 200, 100));
        }


        this.initHandAnimation();
        this.initArmAnimation();
        this.initTorsoAnimation();

        this.initBackBtn(game);
        this.initVolIcon();


        this.arrowLeft = this.add.button(this.camera.view.centerX - 400, this.camera.view.centerY, 'arrowLeft', this.levelDownOnClick, this, 2, 1, 0);
        this.arrowLeft.scale.setTo(2, 2);
        this.arrowLeft.anchor.setTo(0.5, 0.5);
        if (levelShowing == 1) {
            this.arrowLeft.visible = false;
            this.armAnimation.visible = false;
            this.torsoAnimation.visible = false;
        }

        if (levelShowing == 2) {
            this.handAnimation.visible = false;
            this.torsoAnimation.visible = false;
            if (levelShowing > user.getLevel()) {
                this.armAnimation.visible = false;
            }
        }

        this.arrowRight = this.add.button(this.camera.view.centerX + 400, this.camera.view.centerY, 'arrowRight', this.levelUpOnClick, this, 2, 1, 0);
        this.arrowRight.scale.setTo(2, 2);
        this.arrowRight.anchor.setTo(0.5, 0.5);
        if (levelShowing == 3) {
            this.arrowRight.visible = false;
            this.handAnimation.visible = false;
            this.armAnimation.visible = false;
            if (levelShowing > user.getLevel()) {
                this.torsoAnimation.visible = false;
            }
        }

    },
    update: function () {
        if (keys['ONE'].isDown) {
            Level = 'ONE';
            user.setLevel(1);
            user.setStage(1);
            this.game.state.start('LevelSelecting');
        }
        if (keys['TWO'].isDown) {
            Level = 'TWO';
            user.setLevel(1);
            user.setStage(2);
            this.game.state.start('LevelSelecting');
        }
        if (keys['THREE'].isDown) {
            user.setLevel(1);
            user.setStage(3);
            this.game.state.start('LevelSelecting');
        }
        if (keys['FOUR'].isDown) {
            user.setLevel(2);
            user.setStage(1);
            this.game.state.start('LevelSelecting');
        }
        if (keys['FIVE'].isDown) {
            user.setLevel(2)
            user.setStage(2);
            this.game.state.start('LevelSelecting');
        }
        if (keys['SIX'].isDown) {
            user.setLevel(2);
            user.setStage(3);
            this.game.state.start('LevelSelecting');
        }
        if (keys['SEVEN'].isDown) {
            user.setLevel(3);
            user.setStage(1);
            this.game.state.start('LevelSelecting');
        }
        if (keys['EIGHT'].isDown) {
            user.setLevel(3);
            user.setStage(2);
            this.game.state.start('LevelSelecting');
        }
        if (keys['NINE'].isDown) {
            user.setLevel(3);
            user.setStage(3);
            this.game.state.start('LevelSelecting');
        }


    },
    createButton: function (game, currentShowingLevel, StageNum, x, y, w, h) {
        var b;
        // console.log('currentShowingLevel');
        // console.log(currentShowingLevel);
        // console.log('stage number');
        // console.log(StageNum);

        if (currentShowingLevel == user.getLevel() && StageNum < user.getStage()) {
            b = this.add.button(x, y - 50, 'levelBtn',
                function () {
                    pop.play();
                    Level = itoaArray[StageNum];
                    game.state.start("Level" + currentShowingLevel + "_stage" + (StageNum + 1));

                }
                , 2, 1, 0);

        } else if (currentShowingLevel < user.getLevel()) {
            b = this.add.button(x, y - 50, 'levelBtn',
                function () {
                    pop.play();
                    Level = itoaArray[StageNum];
                    game.state.start("Level" + currentShowingLevel + "_stage" + (StageNum + 1));

                }
                , 2, 1, 0);
        } else {
            b = this.add.button(x, y - 50, 'disabledLevelBtn',
                function () {
                    console.log("currently rocked.");
                    console.log(this);
                    this.camera.shake(0.01, 100);
                }, this
                , 2, 1, 0);

        }

        b.anchor.setTo(0.5, 0.5);
        b.width = w;
        b.height = h;
        this.add.tween(b).to({ y: y }, 500, Phaser.Easing.Bounce.Out, true);

        b.txt = this.add.text(b.x, b.y - 50, itoaArray[StageNum], {
            font: '32px Aclonica', fill: "#ff3823",
            align: "center"
        });
        b.txt.anchor.setTo(0.5, 0.5);
        this.add.tween(b.txt).to({ y: y }, 500, Phaser.Easing.Bounce.Out, true);

        return b;

    },
    initHandAnimation: function () {

        var pos = 3;
        if (levelShowing == user.getLevel()) {
            pos = user.getStage();
        }

        this.handAnimation = this.add.sprite(this.camera.view.centerX + (pos - 3) * 250, this.camera.view.centerY - 50, 'hand');
        this.handAnimation.anchor.setTo(0.5, 0.5);
        this.handAnimation.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 5), 10, true);
        this.handAnimation.animations.play('right');
        this.add.tween(this.handAnimation).to({ x: this.camera.view.centerX + (pos - 2) * 250 }, 1500, "Linear", true);

    },
    initArmAnimation: function () {

        var pos = 3;
        if (levelShowing == user.getLevel()) {
            pos = user.getStage();
        }

        this.armAnimation = this.add.sprite(this.camera.view.centerX + (pos - 3) * 250, this.camera.view.centerY - 50, 'arm');
        this.armAnimation.anchor.setTo(0.5, 0.5);
        this.armAnimation.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 5), 10, true);
        this.armAnimation.animations.play('right');
        this.add.tween(this.armAnimation).to({ x: this.camera.view.centerX + (pos - 2) * 250 }, 1500, "Linear", true);
    },
    initTorsoAnimation: function () {

        var pos = 3;
        if (levelShowing == user.getLevel()) {
            pos = user.getStage();
        }

        this.torsoAnimation = this.add.sprite(this.camera.view.centerX + (pos - 3) * 250, this.camera.view.centerY - 50, 'torso');
        this.torsoAnimation.anchor.setTo(0.5, 0.5);
        this.torsoAnimation.animations.add('right', Phaser.Animation.generateFrameNames('r', 1, 4), 10, true);
        this.torsoAnimation.animations.play('right');
        this.add.tween(this.torsoAnimation).to({ x: this.camera.view.centerX + (pos - 2) * 250 }, 1500, "Linear", true);
    },
    initBackBtn: function (game) {
        var backBtn = this.add.button(this.camera.view.centerX - this.game.width / 2.5, this.camera.view.centerY + this.game.height / 2, 'backBtn', function () {
            game.state.start("MainMenu")
        }, 2, 1, 0);

        backBtn.anchor.setTo(0.5, 0.5);
        backBtn.scale.setTo(0.5, 1);
        backBtn.width = 55;
        backBtn.height = 60;

        var backIcon = this.add.sprite(this.camera.view.centerX - this.game.width / 2.5, this.camera.view.centerY + this.game.height / 2, 'mainMenuIcon');
        backIcon.anchor.setTo(0.5, 0.5);
        backIcon.scale.set(0.5, 0.5);

        this.add.tween(backBtn).to({ y: this.camera.view.centerY + this.game.height / 2.5 }, 500, Phaser.Easing.Bounce.Out, true);
        this.add.tween(backIcon).to({ y: this.camera.view.centerY + this.game.height / 2.5 }, 500, Phaser.Easing.Bounce.Out, true);

    },
    initVolIcon: function () {

        var volIcon = this.add.sprite(this.camera.view.centerX + this.game.width / 2.5, this.camera.view.centerY + this.game.height / 2, icon);
        volIcon.anchor.setTo(0.5, 0.5);

        var volBtn = this.add.button(this.camera.view.centerX + this.game.width / 2.5, this.camera.view.centerY + this.game.height / 2, 'volBtn', function () {
            if (!volumeOn) {
                icon = 'volDownIcon';
                volIcon.loadTexture(icon);
                volumeOn = !volumeOn;
                music.mute = true;
                pop.mute = true;
                crash.mute = true;
            }
            else {
                icon = 'volUpIcon';
                volIcon.loadTexture(icon);
                volumeOn = !volumeOn;
                music.mute = false;
                pop.mute = false;
                crash.mute = false;
            }
        }, 2, 1, 0);

        volBtn.anchor.setTo(0.5, 0.5);
        volBtn.width = 55;
        volBtn.height = 60;

        this.add.tween(volBtn).to({ y: this.camera.view.centerY + this.game.height / 2.5 }, 500, Phaser.Easing.Bounce.Out, true);
        this.add.tween(volIcon).to({ y: this.camera.view.centerY + this.game.height / 2.5 }, 500, Phaser.Easing.Bounce.Out, true);

        this.game.world.bringToTop(volIcon);
    },
    levelDownOnClick: function (levelSelecting) {
        // console.log(this);
        // console.log(a);

        this.buttons.forEach(function (e) {
            var tweenB = levelSelecting.game.add.tween(e).to({ x: levelSelecting.game.width - 100 }, 1000, Phaser.Easing.Default, true);
            tweenB.onComplete.add(function () {
                e.destroy();
            }, this)
            var tweenBTxt = levelSelecting.game.add.tween(e.txt).to({ x: levelSelecting.game.width - 100 }, 1000, Phaser.Easing.Default, true);
            tweenBTxt.onComplete.add(function () {
                e.txt.destroy();
            }, this);
        });

        this.buttons = [];
        levelShowing = levelShowing - 1;

        this.handAnimation.visible = false;
        this.armAnimation.visible = false;


        for (var x = 0; x < 3; x++) {
            this.buttons.push(this.createButton(this, levelShowing, x,
                this.camera.view.centerX + (x - 1) * 250, this.camera.view.centerY, 200, 100));
        }



        if (levelShowing == 1) {
            this.arrowLeft.visible = false;
            if (levelShowing == user.getLevel()) {
                this.armAnimation.visible = false;
                this.handAnimation.visible = true;
                this.add.tween(this.handAnimation).to({ x: this.camera.view.centerX + (user.getStage() - 2) * 250 }, 1500, "Linear", true);
                this.game.world.bringToTop(this.handAnimation);
            } else if (levelShowing < user.getLevel()) {
                this.armAnimation.visible = false;
                this.handAnimation.visible = true;
                this.add.tween(this.handAnimation).to({ x: this.camera.view.centerX + (3 - 2) * 250 }, 1500, "Linear", true);
                this.game.world.bringToTop(this.handAnimation);
            }
        } else if (levelShowing == 2) {
            // this.arrowLeft.visible = true;
            if (levelShowing == user.getLevel()) {
                this.torsoAnimation.visible = false;
                this.armAnimation.visible = true;
                this.add.tween(this.armAnimation).to({ x: this.camera.view.centerX + (user.getStage() - 2) * 250 }, 1500, "Linear", true);
                this.game.world.bringToTop(this.armAnimation);
            } else if (levelShowing < user.getLevel()) {
                this.torsoAnimation.visible = false;
                this.armAnimation.visible = true;
                this.add.tween(this.armAnimation).to({ x: this.camera.view.centerX + (3 - 2) * 250 }, 1500, "Linear", true);
                this.game.world.bringToTop(this.armAnimation);
            }
        }

        this.arrowRight.visible = true;
    },

    levelUpOnClick: function (levelSelecting) {

        this.buttons.forEach(function (e) {
            var tweenB = levelSelecting.game.add.tween(e).to({ x: 100 }, 1000, Phaser.Easing.Default, true);
            tweenB.onComplete.add(function () {
                e.destroy();
            }, this)
            var tweenBTxt = levelSelecting.game.add.tween(e.txt).to({ x: 100 }, 1000, Phaser.Easing.Default, true);
            tweenBTxt.onComplete.add(function () {
                e.txt.destroy();
            }, this);
        });

        this.handAnimation.visible = false;
        this.armAnimation.visible = false;


        levelShowing = levelShowing + 1;

        this.buttons = [];
        for (var x = 0; x < 3; x++) {
            this.buttons.push(this.createButton(this, levelShowing, x,
                this.camera.view.centerX + (x - 1) * 250, this.camera.view.centerY, 200, 100));
        }


        if (levelShowing == 3) {
            this.arrowRight.visible = false;
            if (levelShowing == user.getLevel()) {
                this.armAnimation.visible = false;
                this.torsoAnimation.visible = true;
                this.add.tween(this.torsoAnimation).to({ x: this.camera.view.centerX + (user.getStage() - 2) * 250 }, 1500, "Linear", true);
                this.game.world.bringToTop(this.torsoAnimation);
            } else if (levelShowing < user.getLevel()) {
                this.armAnimation.visible = false;
                this.torsoAnimation.visible = true;
                this.add.tween(this.torsoAnimation).to({ x: this.camera.view.centerX + (3 - 2) * 250 }, 1500, "Linear", true);
                this.game.world.bringToTop(this.torsoAnimation);
            }
        } else if (levelShowing == 2) {
            // this.arrowRight.visible = true;
            if (levelShowing == user.getLevel()) {
                this.handAnimation.visible = false;
                this.armAnimation.visible = true;
                this.add.tween(this.armAnimation).to({ x: this.camera.view.centerX + (user.getStage() - 2) * 250 }, 1500, "Linear", true);
                this.game.world.bringToTop(this.armAnimation);
            } else if (levelShowing < user.getLevel()) {
                this.handAnimation.visible = false;
                this.armAnimation.visible = true;
                this.add.tween(this.armAnimation).to({ x: this.camera.view.centerX + (3 - 2) * 250 }, 1500, "Linear", true);
                this.game.world.bringToTop(this.armAnimation);
            }
        }


        this.arrowLeft.visible = true;

    }

}
