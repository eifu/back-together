BackTogether.MainMenu = function (game) {

};
var play;
var menuLayer;
var settings;

var menuBtns;
var helpNodes;

var helpSelected;
var settingSelected;

var map;

var wfconfig = {
    google: {
        families: ['Aclonica']
    }
};

BackTogether.MainMenu.prototype = {
    create: function (game) {
        WebFont.load(wfconfig);
        game.stage.backgroundColor = "#570e28";

        map = this.add.tilemap('map', 64, 64);
        map.addTilesetImage('tileset');

        var menuLayer = map.createLayer('pausedLayer');
        // menuLayer.resizeWorld();
        menuLayer.alpha = 0.6;
        
        var txt = game.add.text(this.camera.view.centerX, 50, "BACK TOGETHER", {
        font: '60px Aclonica', fill: "#000",
        align: "center"
        });
        
        txt.anchor.setTo(0.5, 0.5);

        playBtn = game.add.button(this.camera.view.centerX, this.camera.view.centerY - 170, 'mainMenuBtn', startOnClick, this, 2, 1, 0);
        playBtn.anchor.setTo(0.5, 0.5);
        playBtn.scale.setTo(3.0, 3.0);

        settingBtn = game.add.button(this.camera.view.centerX, this.camera.view.centerY - 70, 'mainMenuBtn', showSettings, this, 2, 1, 0);
        settingBtn.anchor.setTo(0.5, 0.5);
        settingBtn.scale.setTo(3.0, 3.0);

        helpBtn = game.add.button(this.camera.view.centerX, this.camera.view.centerY+30, 'mainMenuBtn', showHelp, this, 2, 1, 0);
        helpBtn.anchor.setTo(0.5, 0.5);
        helpBtn.scale.setTo(3.0, 3.0);

        menuBtns = [];
        menuBtns.push(playBtn);
        menuBtns.push(settingBtn);
        menuBtns.push(helpBtn);

        titleFontStyle = { font: '60px Aclonica', fill: "#C0C0C0", align: "center" }
        btnFontStyle = { font: '50px Aclonica', fill: "#C0C0C0", align: "center" }

        var titleTxt = game.add.text(this.camera.view.centerX, 50, "BACK TOGETHER", titleFontStyle);
        titleTxt.anchor.setTo(0.5, 0.5);

        var playBtnTxt = game.add.text(this.camera.view.centerX, this.camera.view.centerY - 170, "Play", btnFontStyle);
        playBtnTxt.anchor.setTo(0.5, 0.5);

        var settingBtnTxt = game.add.text(this.camera.view.centerX, this.camera.view.centerY - 70, "Settings", btnFontStyle);
        settingBtnTxt.anchor.setTo(0.5, 0.5);

        var helpBtnTxt = game.add.text(this.camera.view.centerX, this.camera.view.centerY + 30, "Help", btnFontStyle);
        helpBtnTxt.anchor.setTo(0.5, 0.5);

        helpNodes = [];

        function startOnClick() {
            game.state.start("LevelSelecting");
        }

        function showSettings() {
            console.log('setting button pressed')
        }

        function showHelp() {

            menuBtns.forEach(function (e) {
                e.inputEnabled = false;
            });

            helpLayer = map.createLayer('pausedLayer');
            helpLayer.alpha = 0;

            helpLayerCard = game.add.image(this.camera.view.centerX, this.camera.view.centerY, 'menuBtnCard');
            helpLayerCard.anchor.setTo(0.5, 0.5);
            helpLayerCard.alpha = 0;

            helpFontStyle = { font: '20px Aclonica', fill: "#F00", align: "center" };
            helpTitleFontStyle = { font: '40px Aclonica', fill: "#F00", align: "center" };

            helpTitleTxt = game.add.text(this.camera.view.centerX, this.camera.view.centerY - 50, "How to play", helpTitleFontStyle);
            helpTitleTxt.anchor.setTo(0.5, 0.5);
            helpTitleTxt.alpha = 0;

            helpTxt = game.add.text(this.camera.view.centerX, this.camera.view.centerY, "Press to exit help screen", helpFontStyle);
            helpTxt.anchor.setTo(0.5, 0.5);
            helpTxt.alpha = 0;

            helpTxt2 = game.add.text(this.camera.view.centerX, this.camera.view.centerY+ 75, "←:left \n →:right \n ↑:jump \n ↓:hold item or drop item", helpFontStyle);
            helpTxt2.anchor.setTo(0.5, 0.5);
            helpTxt2.alpha = 0;

            helpTxt3 = game.add.text(this.camera.view.centerX, this.camera.view.centerY + 165, "Click any place to go back.", helpFontStyle);
            helpTxt3.anchor.setTo(0.5, 0.5);
            helpTxt3.alpha = 0;


            helpNodes.push(helpLayer);
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
                    helpNodes = [];
                    helpSelected = false;
                    menuBtns.forEach(function (e) {
                        e.inputEnabled = true;
                    });
                }
            }
        }

        if (settingSelected) {

        }

    }


}

