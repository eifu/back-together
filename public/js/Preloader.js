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
        this.load.spritesheet('levelBtn', 'assets/levelBtn.png',110,60);
        this.load.image('pausedBtn', 'assets/pausedBtn.png');
        this.load.image('pausedBtnCard', 'assets/pausedBtnCard.png');
        this.load.image('resetIcon', 'assets/resetIcon.png');
        this.load.image('settingIcon', 'assets/settingIcon.png');
        this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        this.load.tilemap('map', 'assets/test.json', null, Phaser.Tilemap.TILED_JSON);

        this.load.image('tileset', 'assets/tileset.png');

    },

    create: function () {
        this.state.start("Level");
    }

}


