BackTogether.MainMenu = function (game) {

};
var play;
var menuLayer;
var helpLayer;
var settings;
var help;
var helpLayerCardBtn;
var helpLayer;
var helpTxt;
var helpTxt2;
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

        menuLayer = map.createLayer('pausedLayer');
        // menuLayer.resizeWorld();
        menuLayer.alpha = 0.6;

        playBtn = game.add.button(game.world.centerX, game.world.centerY - 170, 'mainMenuBtn', startOnClick, this, 2, 1, 0);
        playBtn.anchor.setTo(0.5, 0.5);
        playBtn.scale.setTo(3.0,3.0);

        settingBtn = game.add.button(game.world.centerX, game.world.centerY - 70, 'mainMenuBtn', showSettings, this, 2, 1, 0);
        settingBtn.anchor.setTo(0.5, 0.5);
        settingBtn.scale.setTo(3.0,3.0);

        helpBtn = game.add.button(game.world.centerX, game.world.centerY+30, 'mainMenuBtn', showHelp, this, 2, 1, 0);
        helpBtn.anchor.setTo(0.5, 0.5);
        helpBtn.scale.setTo(3.0,3.0);

        titleFontStyle = {font: '60px Aclonica', fill: "#C0C0C0",align: "center"}
        btnFontStyle = {font: '50px Aclonica', fill: "#C0C0C0",align: "center"}

        var titleTxt = game.add.text(game.world.centerX, 50, "BACK TOGETHER", titleFontStyle);
        titleTxt.anchor.setTo(0.5, 0.5);

        var playBtnTxt = game.add.text(game.world.centerX, game.world.centerY - 170, "Play", btnFontStyle);
        playBtnTxt.anchor.setTo(0.5, 0.5);

        var settingBtnTxt = game.add.text(game.world.centerX, game.world.centerY - 70, "Settings", btnFontStyle);
        settingBtnTxt.anchor.setTo(0.5, 0.5);

        var helpBtnTxt = game.add.text(game.world.centerX, game.world.centerY + 30, "Help", btnFontStyle);
        helpBtnTxt.anchor.setTo(0.5, 0.5);

        function startOnClick() {
            game.state.start("LevelSelecting");
        }

        function showSettings() {
            console.log('setting button pressed')
        }

        function showHelp() {

            helpLayer = map.createLayer('pausedLayer');
            helpLayer.alpha = 0.1;

            helpLayerCardBtn = game.add.button(game.world.centerX, game.world.centerY, 'menuBtnCard', exitHelp, this, 2, 1, 0);
            helpLayerCardBtn.anchor.setTo(0.5, 0.5);

            helpTxt = game.add.text(game.world.centerX, game.world.centerY, "Press to exit help screen", {
                font: '20px Aclonica', fill: "#F00",
                align: "center"
            });
            helpTxt.anchor.setTo(0.5, 0.5);

            helpTxt2 = game.add.text(game.world.centerX, game.world.centerY + 75, "←:left \n →:right \n ↑:jump \n ↓:hold item or drop item", {
                font: '20px Aclonica', fill: "#F00",
                align: "center"
            });
            helpTxt2.anchor.setTo(0.5, 0.5);

            function exitHelp() {
                helpLayerCardBtn.destroy();
                helpLayer.destroy();
                helpTxt.destroy();
                helpTxt2.destroy();
            }

        }

    }
}

