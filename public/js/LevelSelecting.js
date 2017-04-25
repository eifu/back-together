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
            'ONE', 'TWO', 'UP', 'LEFT', 'RIGHT', 'DOWN', 'SPACE', 'W', 'A', 'S', 'D', 'O', 'P'
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

        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 4; x++) {
                this.createButton(game, y * 4 + x,
                    this.camera.view.centerX + x * 120 - 180, this.camera.view.centerY + 70 * y - 80,
                    110, 60)
            }
        }

        hand = this.add.sprite(this.camera.view.centerX + (user.getLevel() - 1) * 120 - 300, this.camera.view.centerY - 120, 'hand');
        hand.anchor.setTo(0.5, 0.5);
        hand.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 5), 10, true);
        hand.animations.play('right');
        game.add.tween(hand).to({ x: this.camera.view.centerX + user.getLevel() * 120 - 300 }, 1500, "Linear", true);

        var backBtn = game.add.button(this.camera.view.centerX - game.width / 2.5, this.camera.view.centerY + game.height / 2, 'backBtn', function () {
            game.state.start("MainMenu")
        }, 2, 1, 0);

        backBtn.anchor.setTo(0.5, 0.5);
        backBtn.scale.setTo(0.5, 1);
        backBtn.width = 55;
        backBtn.height = 60;

        var backIcon = this.add.sprite(this.camera.view.centerX - game.width / 2.5, this.camera.view.centerY + game.height / 2, 'mainMenuIcon');
        backIcon.anchor.setTo(0.5, 0.5);
        backIcon.scale.set(0.5, 0.5);

        game.add.tween(backBtn).to({ y: this.camera.view.centerY + game.height / 2.5 }, 500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(backIcon).to({ y: this.camera.view.centerY + game.height / 2.5 }, 500, Phaser.Easing.Bounce.Out, true);
        
        var volIcon = this.add.sprite(this.camera.view.centerX + game.width / 2.5, this.camera.view.centerY + game.height / 2, icon);
        volIcon.anchor.setTo(0.5, 0.5);
        
        var volBtn = game.add.button(this.camera.view.centerX + game.width / 2.5, this.camera.view.centerY + game.height / 2, 'volBtn', function () {
            if(!volumeOff){
                icon = 'volUpIcon';
                volIcon.loadTexture(icon);
                volumeOff = !volumeOff;
            }
            else{
                icon = 'volDownIcon';
                volIcon.loadTexture(icon);
                volumeOff = !volumeOff;
            }
        }, 2, 1, 0);

        volBtn.anchor.setTo(0.5, 0.5);
        volBtn.width = 55;
        volBtn.height = 60;

        game.add.tween(volBtn).to({ y: this.camera.view.centerY + game.height / 2.5 }, 500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(volIcon).to({ y: this.camera.view.centerY + game.height / 2.5 }, 500, Phaser.Easing.Bounce.Out, true);
        
        game.world.bringToTop(volIcon);
    },
    update: function () {
        if(keys['ONE'].isDown){
            Level = 'ONE';
            this.game.state.start('Level1');
        }
        if(keys['TWO'].isDown){
            Level = 'TWO';
            this.game.state.start('Level2');
        }   
    },
    createButton: function (game, i, x, y, w, h) {
        var b;
        if (i < user.getLevel()) {
            b = game.add.button(x, y - 50, 'levelBtn',
                function () {
                    Level = itoaArray[i];
                    game.state.start("Level"+(i+1));

                }
                , 2, 1, 0);

        } else {
            b = game.add.button(x, y - 50, 'disabledLevelBtn',
                function () {
                    console.log("currently rocked.");
                    game.camera.shake(0.01, 100);
                }
                , 2, 1, 0);

        }

        b.anchor.setTo(0.5, 0.5);
        b.width = w;
        b.height = h;
        game.add.tween(b).to({ y: y }, 500, Phaser.Easing.Bounce.Out, true);

        var txt = game.add.text(b.x, b.y - 50, itoaArray[i], {
            font: '16px Aclonica', fill: "#ff3823",
            align: "center"
        });

        txt.anchor.setTo(0.5, 0.5);
        game.add.tween(txt).to({ y: y }, 500, Phaser.Easing.Bounce.Out, true);
    }


}
