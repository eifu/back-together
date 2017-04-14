BackTogether.Level = function (game) {

};
var Level;
var wfconfig = {
    google: {
        families: ['Aclonica']
    }
};

var map;
var menuLayer;

BackTogether.Level.prototype = {
    create: function (game) {
        WebFont.load(wfconfig);
        game.stage.backgroundColor = "#570e28";


        map = this.add.tilemap('map', 64, 64);
        map.addTilesetImage('tileset');

        menuLayer = map.createLayer('pausedLayer');
        // menuLayer.resizeWorld();
        menuLayer.alpha = 0.6;

        menuLayerCard = game.add.button(game.world.centerX, game.world.centerY, 'menuBtnCard', startOnClick, this, 2, 1, 0);
        menuLayerCard.anchor.setTo(0.5, 0.5);
        menuLayerCard.scale.setTo(2,1.5);

        menuTxt = game.add.text(game.world.centerX, game.world.centerY, "Press to go to select level", {
            font: '20px Aclonica', fill: "#F00",
            align: "center"
        });
        menuTxt.anchor.setTo(0.5, 0.5);

        menuTxt2 = game.add.text(game.world.centerX, game.world.centerY + 30, "←:left, →:right, ↑:jump", {
            font: '20px Aclonica', fill: "#F00",
            align: "center"
        });
        menuTxt2.anchor.setTo(0.5, 0.5);

        menuTxt3 = game.add.text(game.world.centerX, game.world.centerY + 60, "↓:hold item or drop item", {
            font: '20px Aclonica', fill: "#F00",
            align: "center"
        });
        menuTxt3.anchor.setTo(0.5, 0.5);

        function startOnClick() {
            menuLayerCard.destroy();
            menuLayer.destroy();
            menuTxt.destroy();
            menuTxt2.destroy();
            menuTxt3.destroy();
        }


        var l = game.add.sprite(game.world.centerX, game.world.centerY + 60, 'logo');
        l.anchor.setTo(0.5, 0.5);

        var txt = game.add.text(game.world.centerX, 50, "SELECT YOUR LEVEL", {
            font: '60px Aclonica', fill: "#000",
            align: "center"
        });

        txt.anchor.setTo(0.5, 0.5);


        var itoaArray = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN',
            'ELEVEN', 'TWELVE']

        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 4; x++) {
                this.createButton(game, itoaArray[y * 4 + x],
                    game.world.centerX + (x + 1) * 120 - 60 - 240, game.world.centerY + 70 * y - 80,
                    110, 60, function () {
                        game.state.start("Main");
                    })
            }
        }
        game.world.bringToTop(menuLayer);
        game.world.bringToTop(menuLayerCard);
        game.world.bringToTop(menuTxt);
        game.world.bringToTop(menuTxt2);
        game.world.bringToTop(menuTxt3);

    },
    update: function () {

    },
    createButton: function (game, string, x, y, w, h, callback) {
        var b = game.add.button(x, y, 'levelBtn',
            function () {
                Level = string;
                callback();
            }
            , 2, 1, 0);

        b.anchor.setTo(0.5, 0.5);
        b.width = w;
        b.height = h;

        var txt = game.add.text(b.x, b.y, string, {
            font: '16px Aclonica', fill: "#ff3823",
            align: "center"
        });

        txt.anchor.setTo(0.5, 0.5);

    }


}
