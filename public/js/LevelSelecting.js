BackTogether.LevelSelecting = function (game) {

};
var Level;
var wfconfig = {
    google: {
        families: ['Aclonica']
    }
};

var menuLayer;

BackTogether.LevelSelecting.prototype = {
    create: function (game) {
        WebFont.load(wfconfig);
        game.stage.backgroundColor = "#570e28";


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
                    game.state.start("Level1");
                    
                    })
            }
        }
//        game.world.bringToTop(menuLayer);
//        game.world.bringToTop(menuLayerCard);
//        game.world.bringToTop(menuTxt);
//        game.world.bringToTop(menuTxt2);
//        game.world.bringToTop(menuTxt3);

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
