BackTogether.MainMenu = function (game) {

};
var play;
var keys;

var settings;

var menuBtns;
var helpNodes;

var helpSelected;

var wfconfig = {
    google: {
        families: ['Aclonica']
    }
};

BackTogether.MainMenu.prototype = {
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
        WebFont.load(wfconfig);
        game.stage.backgroundColor = "#570e28";
        
        var txt = game.add.text(this.camera.view.centerX, 50, "BACK TOGETHER", {
        font: '60px Aclonica', fill: "#000",
        align: "center"
        });
        
        txt.anchor.setTo(0.5, 0.5);

        newGameBtn = game.add.button(this.camera.view.centerX, this.camera.view.centerY - 170, 'mainMenuBtn', startOnClick, this, 2, 1, 0);
        newGameBtn.anchor.setTo(0.5, 0.5);
        newGameBtn.scale.setTo(3.0, 3.0);

        loadGameBtn = game.add.button(this.camera.view.centerX, this.camera.view.centerY - 70, 'mainMenuBtn', startOnClick, this, 2, 1, 0);
        loadGameBtn.anchor.setTo(0.5, 0.5);
        loadGameBtn.scale.setTo(3.0, 3.0);

//        settingBtn = game.add.button(this.camera.view.centerX, this.camera.view.centerY + 30, 'mainMenuBtn', showSettings, this, 2, 1, 0);
//        settingBtn.anchor.setTo(0.5, 0.5);
//        settingBtn.scale.setTo(3.0, 3.0);

        helpBtn = game.add.button(this.camera.view.centerX, this.camera.view.centerY + 30, 'mainMenuBtn', showHelp, this, 2, 1, 0);
        helpBtn.anchor.setTo(0.5, 0.5);
        helpBtn.scale.setTo(3.0, 3.0);

        menuBtns = [];
        menuBtns.push(newGameBtn);
        menuBtns.push(loadGameBtn);
//        menuBtns.push(settingBtn);
        menuBtns.push(helpBtn);

        titleFontStyle = { font: '60px Aclonica', fill: "#C0C0C0", align: "center" }
        btnFontStyle = { font: '50px Aclonica', fill: "#C0C0C0", align: "center" }

        var titleTxt = game.add.text(this.camera.view.centerX, 50, "BACK TOGETHER", titleFontStyle);
        titleTxt.anchor.setTo(0.5, 0.5);

        var newGameBtnTxt = game.add.text(this.camera.view.centerX, this.camera.view.centerY - 170, "New Game", btnFontStyle);
        newGameBtnTxt.anchor.setTo(0.5, 0.5);

        var loadGameBtnTxt = game.add.text(this.camera.view.centerX, this.camera.view.centerY - 70, "Load Game", btnFontStyle);
        loadGameBtnTxt.anchor.setTo(0.5, 0.5);

//        var settingBtnTxt = game.add.text(this.camera.view.centerX, this.camera.view.centerY + 30, "Settings", btnFontStyle);
//        settingBtnTxt.anchor.setTo(0.5, 0.5);

        var helpBtnTxt = game.add.text(this.camera.view.centerX, this.camera.view.centerY + 30, "Help", btnFontStyle);
        helpBtnTxt.anchor.setTo(0.5, 0.5);
        
        var volIcon = this.add.sprite(this.camera.view.centerX + game.width / 2.5, this.camera.view.centerY + game.height / 2.5, icon);
        volIcon.anchor.setTo(0.5, 0.5);
        
        var volBtn = game.add.button(this.camera.view.centerX + game.width / 2.5, this.camera.view.centerY + game.height / 2.5, 'volBtn', function () {
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
        
        game.world.bringToTop(volIcon);

        helpNodes = [];

        function startOnClick() {
            game.state.start("LevelSelecting");
        }

        function showSettings() {
            game.state.start("Settings");
        }

        function showHelp() {

            menuBtns.forEach(function (e) {
                e.inputEnabled = false;
            });

            // TODO: we should add some image that darken the entire screen. but do not use map.
            // helpLayer = game.add.image('');
            // helpLayer.alpha = 0.5;

            helpLayerCard = game.add.image(this.camera.view.centerX, this.camera.view.centerY, 'menuBtnCard');
            helpLayerCard.anchor.setTo(0.5, 0.5);
            helpLayerCard.scale.setTo(0.8,0.8)
            helpLayerCard.alpha = 0;

            helpFontStyle = { font: '20px Aclonica', fill: "#F00", align: "center" };
            helpTitleFontStyle = { font: '40px Aclonica', fill: "#F00", align: "center" };

            helpTitleTxt = game.add.text(this.camera.view.centerX, this.camera.view.centerY - 100, "How to play", helpTitleFontStyle);
            helpTitleTxt.anchor.setTo(0.5, 0.5);
            helpTitleTxt.alpha = 0;

            helpTxt = game.add.text(this.camera.view.centerX, this.camera.view.centerY-30, "Press to exit help screen", helpFontStyle);
            helpTxt.anchor.setTo(0.5, 0.5);
            helpTxt.alpha = 0;

            helpTxt2 = game.add.text(this.camera.view.centerX, this.camera.view.centerY+ 45, "←:left \n →:right \n ↑:jump \n ↓:hold item or drop item", helpFontStyle);
            helpTxt2.anchor.setTo(0.5, 0.5);
            helpTxt2.alpha = 0;

            helpTxt3 = game.add.text(this.camera.view.centerX, this.camera.view.centerY + 135, "Click any place to go back.", helpFontStyle);
            helpTxt3.anchor.setTo(0.5, 0.5);
            helpTxt3.alpha = 0;


            helpNodes.push(helpLayerCard);
            helpNodes.push(helpTitleTxt);
            helpNodes.push(helpTxt);
            helpNodes.push(helpTxt2);
            helpNodes.push(helpTxt3);

            helpSelected = true;

        }

    },

    update: function (game) {
        if (helpSelected) {
            if (helpNodes[0].alpha <= 1) {
                helpNodes.forEach(function (e) {
                    e.alpha += 0.05;
                })
            } else {
                if (game.input.mousePointer.isDown) {
                    helpNodes.forEach(function (e) {
                        e.destroy();
                    })
                    // helpLayer.destroy();
                    helpNodes = [];
                    helpSelected = false;
                    menuBtns.forEach(function (e) {
                        e.inputEnabled = true;
                    });
                }
            }
        }
        if(keys['ONE'].isDown){
            Level = 'ONE';
            this.game.state.start('Level1');
        }
        if(keys['TWO'].isDown){
            Level = 'TWO';
            this.game.state.start('Level2');
        }
    }


}

