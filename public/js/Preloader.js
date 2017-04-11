Game.Preloader = function (game) {

};


Game.Preloader.prototype = {

    preload: function () {
        this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, "preloadBar");

        this.preloadBar.anchor.setTo(0.5, 0.5);

        this.time.advancedTiming = true;

        this.load.setPreloadSprite(this.preloadBar);
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('logo', 'assets/logo.jpg');
        this.load.spritesheet('levelBtn', 'assets/levelBtn.png', 110, 60);
        this.load.image('pausedBtn', 'assets/pausedBtn.png');
        this.load.image('pausedBtnCard', 'assets/pausedBtnCard.png');
        this.load.image('resetIcon', 'assets/resetIcon.png');
        this.load.image('settingIcon', 'assets/settingIcon.png');
        this.load.image('cancelIcon', 'assets/cancelIcon.png');
        this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        this.load.spritesheet('enemy', 'assets/enemy.png', 32, 48);
        this.load.tilemap('map', 'assets/test.json', null, Phaser.Tilemap.TILED_JSON);

        this.load.atlasJSONArray('hand', 'assets/hand.png', 'assets/hand.json');
        this.load.atlasJSONArray('enemy1', 'assets/enemy1.png', 'assets/enemy1.json');

        this.load.spritesheet('pipe', 'assets/pipe.png', 64, 16);
        this.load.image('hold', 'assets/hold.png');
        this.load.image('tileset', 'assets/tileset.png');

        this.load.script("webfont", "//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js");
        // The Google WebFont Loader will look for this object,
        //    so create it before loading the script.
        WebFontConfig = {
            //  The Google Fonts we want to load (specify as many as you like in the array)
            google: {
                families: ["Aclonica"]
            }

        };

    },

    create: function () {
        this.state.start("Level");
        
    }

}


