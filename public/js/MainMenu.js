BackTogether.MainMenu = function (game) {

};

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
        
        var txt = game.add.text(game.world.centerX, 50, "BACK TOGETHER", {
        font: '60px Aclonica', fill: "#000",
        align: "center"
        });
        
        txt.anchor.setTo(0.5, 0.5);

        var playBtn = game.add.button(game.world.centerX, game.world.centerY-70, 'mainMenuBtn', startOnClick, this, 2, 1, 0);
        playBtn.anchor.setTo(0.5, 0.5);
        
        var settingsBtn = game.add.button(game.world.centerX, game.world.centerY, 'mainMenuBtn', showSettings, this, 2, 1, 0);
        settingsBtn.anchor.setTo(0.5, 0.5);        
        
        var helpBtn = game.add.button(game.world.centerX, game.world.centerY+70, 'mainMenuBtn', showHelp, this, 2, 1, 0);
        helpBtn.anchor.setTo(0.5, 0.5);
        

        var menuTxt = game.add.text(game.world.centerX, game.world.centerY-70, "Play", {
            font: '20px Aclonica', fill: "#F00",
            align: "center"
        });
        menuTxt.anchor.setTo(0.5, 0.5);

        var menuTxt2 = game.add.text(game.world.centerX, game.world.centerY, "Settings", {
            font: '20px Aclonica', fill: "#F00",
            align: "center"
        });
        menuTxt2.anchor.setTo(0.5, 0.5);
        
        var menuTxt3 = game.add.text(game.world.centerX, game.world.centerY + 70, "Help", {
        font: '20px Aclonica', fill: "#F00",
        align: "center"
        });
        menuTxt3.anchor.setTo(0.5, 0.5);

        function startOnClick() {
            game.state.start("LevelSelecting");
        }
            
        function showSettings() {
            
        }
        
        function showHelp(){

        var helpLayer = map.createLayer('pausedLayer');
        // menuLayer.resizeWorld();
        helpLayer.alpha = 0.4;

        var helpBtn = game.add.button(game.world.centerX, game.world.centerY, 'menuBtnCard', exitHelp, this, 2, 1, 0);
        helpBtn.anchor.setTo(0.5, 0.5);
        helpBtn.scale.setTo(2,1.5);

        var helpTxt = game.add.text(game.world.centerX, game.world.centerY, "Press to exit help screen", {
            font: '20px Aclonica', fill: "#F00",
            align: "center"
        });
        helpTxt.anchor.setTo(0.5, 0.5);

        var helpTxt2 = game.add.text(game.world.centerX, game.world.centerY + 75, "←:left \n →:right \n ↑:jump \n ↓:hold item or drop item", {
            font: '20px Aclonica', fill: "#F00",
            align: "center"
        });
        helpTxt2.anchor.setTo(0.5, 0.5);
        
        function exitHelp(){
            helpBtn.destroy();
            helpLayer.destroy();
            helpTxt.destroy();
            helpTxt2.destroy();
        }

    }
    
    }
}

