BackTogether.LevelSelecting = function (game) {

};

//
//  user info. should be Player.js that handles the data.
// 

User = function () {

};

User.prototype = {
    setLevel: function (level) {
        this.myLevel = level;
    },
    getLevel: function () {
        return this.myLevel;
    }
}

//
var user;
var volDownIcon;
var Level;
var wfconfig = {
    google: {
        families: ['Aclonica']
    }
};

var menuLayer;

var itoaArray;

BackTogether.LevelSelecting.prototype = {
    create: function (game) {

        var inputs = [
            Phaser.Keyboard.ONE,
            Phaser.Keyboard.TWO,
            Phaser.Keyboard.THREE,
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
            'ONE', 'TWO', 'THREE', 'UP', 'LEFT', 'RIGHT', 'DOWN', 'SPACE', 'W', 'A', 'S', 'D', 'O', 'P'
        ]

        keys = {};
        inputs.forEach(function (input, i) {
            keys[name[i]] = game.input.keyboard.addKey(input);
        });

        // this is temporaly.
        // user should be initialized at mainmenu. 
        // mainmenu,
        //  |--new game
        //  |--load game
        //
        user = new User();
        user.setLevel(2);



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
            this.buttons.push(this.createButton(game, x,
                this.camera.view.centerX + (x - 1) * 250, this.camera.view.centerY, 200, 100));
        }


        this.initHandAnimation();
        this.initBackBtn(game);
        this.initVolIcon();

        this.arrowLeft = this.add.button(this.camera.view.centerX - 400, this.camera.view.centerY, 'arrowLeft', this.levelDownOnClick, this, 2, 1, 0);
        this.arrowLeft.scale.setTo(2, 2);
        this.arrowLeft.anchor.setTo(0.5, 0.5);

        this.arrowRight = this.add.button(this.camera.view.centerX + 400, this.camera.view.centerY, 'arrowRight', this.levelUpOnClick, this, 2, 1, 0);
        this.arrowRight.scale.setTo(2, 2);
        this.arrowRight.anchor.setTo(0.5, 0.5);

        this.currentLevel = 1;

    },
    update: function () {
        if (keys['ONE'].isDown) {
            Level = 'ONE';
            this.game.state.start('Level1');
        }
        if (keys['TWO'].isDown) {
            Level = 'TWO';
            this.game.state.start('Level1_stage2');
        }
        if (keys['THREE'].isDown) {
            Level = 'THREE';
            this.game.state.start('Level1_stage3');
        }
    },
    createButton: function (game, i, x, y, w, h) {
        var b;
        if (i < user.getLevel()) {
            b = this.add.button(x, y - 50, 'levelBtn',
                function () {
                    pop.play();
                    Level = itoaArray[i];
                    game.state.start("Level" + (i + 1));

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

        b.txt = this.add.text(b.x, b.y - 50, itoaArray[i], {
            font: '16px Aclonica', fill: "#ff3823",
            align: "center"
        });
        b.txt.anchor.setTo(0.5, 0.5);
        this.add.tween(b.txt).to({ y: y }, 500, Phaser.Easing.Bounce.Out, true);

        return b;

    },
    initHandAnimation: function () {

        console.log(user.getLevel());

        this.handAnimation = this.add.sprite(this.camera.view.centerX + (user.getLevel() - 3) * 250, this.camera.view.centerY - 50, 'hand');
        this.handAnimation.anchor.setTo(0.5, 0.5);
        this.handAnimation.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 5), 10, true);
        this.handAnimation.animations.play('right');
        this.add.tween(this.handAnimation).to({ x: this.camera.view.centerX + (user.getLevel() - 2) * 250 }, 1500, "Linear", true);

    },
    initArmAnimation: function () {
        this.armAnimation = this.add.sprite(this.camera.view.centerX + (user.getLevel() - 3) * 250, this.camera.view.centerY - 50, 'arm');
        this.armAnimation.anchor.setTo(0.5, 0.5);
        this.armAnimation.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 5), 10, true);
        this.armAnimation.animations.play('right');
        this.add.tween(this.armAnimation).to({ x: this.camera.view.centerX + (user.getLevel() - 2) * 250 }, 1500, "Linear", true);

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
        if (this.currentLevel == 2) {

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
            this.armAnimation.destroy();

            this.buttons = [];
            for (var x = 0; x < 3; x++) {
                this.buttons.push(this.createButton(this, x,
                    this.camera.view.centerX + (x - 1) * 250, this.camera.view.centerY, 200, 100));
            }
            this.initHandAnimation();

            this.currentLevel = 1;
        }
    },

    levelUpOnClick: function (levelSelecting) {
        if (this.currentLevel == 1) {

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

            this.handAnimation.destroy();


            this.buttons = [];
            for (var x = 0; x < 3; x++) {
                this.buttons.push(this.createButton(this, x,
                    this.camera.view.centerX + (x - 1) * 250, this.camera.view.centerY, 200, 100));
            }
            this.initArmAnimation();

            this.currentLevel = 2;
        }
    }

}
