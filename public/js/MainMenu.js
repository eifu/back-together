BackTogether.MainMenu = function (game) {

};
var play;
var menuLayer;
var helpLayer;
var levelSelect;
var settings;
var help;
var helpLayerCard;
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
        
        var txt = game.add.text(game.world.centerX, 50, "BACK TOGETHER", {
        font: '60px Aclonica', fill: "#000",
        align: "center"
        });
        
        txt.anchor.setTo(0.5, 0.5);

        play = game.add.button(game.world.centerX, game.world.centerY-70, 'mainMenuBtn', initGameplay, this, 2, 1, 0);
        play.anchor.setTo(0.5, 0.5);
        
        levelSelect = game.add.button(game.world.centerX, game.world.centerY, 'mainMenuBtn', startOnClick, this, 2, 1, 0);
        levelSelect.anchor.setTo(0.5, 0.5);
        
        settings = game.add.button(game.world.centerX, game.world.centerY+70, 'mainMenuBtn', showSettings, this, 2, 1, 0);
        settings.anchor.setTo(0.5, 0.5);        
        
        help = game.add.button(game.world.centerX, game.world.centerY+140, 'mainMenuBtn', showHelp, this, 2, 1, 0);
        help.anchor.setTo(0.5, 0.5);
        

        menuTxt = game.add.text(game.world.centerX, game.world.centerY-70, "Play", {
            font: '20px Aclonica', fill: "#F00",
            align: "center"
        });
        menuTxt.anchor.setTo(0.5, 0.5);

        menuTxt2 = game.add.text(game.world.centerX, game.world.centerY, "Levels", {
            font: '20px Aclonica', fill: "#F00",
            align: "center"
        });
        menuTxt2.anchor.setTo(0.5, 0.5);

        menuTxt3 = game.add.text(game.world.centerX, game.world.centerY + 70, "Settings", {
            font: '20px Aclonica', fill: "#F00",
            align: "center"
        });
        menuTxt3.anchor.setTo(0.5, 0.5);
        
        menuTxt4 = game.add.text(game.world.centerX, game.world.centerY + 140, "Help", {
        font: '20px Aclonica', fill: "#F00",
        align: "center"
        });
        menuTxt4.anchor.setTo(0.5, 0.5);
        
        function initGameplay(){
            if(Level != null)
            game.state.start("Level1");
        }

        function startOnClick() {
            game.state.start("LevelSelecting");
        }
            
        function showSettings() {
            
        }
        
        function showHelp(){

        helpLayer = map.createLayer('pausedLayer');
        // menuLayer.resizeWorld();
        helpLayer.alpha = 0.4;

        helpLayerCard = game.add.button(game.world.centerX, game.world.centerY, 'menuBtnCard', exitHelp, this, 2, 1, 0);
        helpLayerCard.anchor.setTo(0.5, 0.5);
        helpLayerCard.scale.setTo(2,1.5);

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
        
        function exitHelp(){
            helpLayerCard.destroy();
            helpLayer.destroy();
            helpTxt.destroy();
            helpTxt2.destroy();
        }

    }
    
    }
}

