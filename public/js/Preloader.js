BackTogether.Preloader = function (game) {

};
BackTogether.Preloader.prototype = {

    preload: function () {
        this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, "preloadBar");

        this.preloadBar.anchor.setTo(0.5, 0.5);

        this.time.advancedTiming = true;

        this.load.setPreloadSprite(this.preloadBar);
        this.load.image('logo', 'assets/images/logo.jpg');
        this.load.image('menuBtnCard', 'assets/images/menuBtnCard.png');
        this.load.spritesheet('levelBtn', 'assets/images/levelBtn.png', 110, 60);
        this.load.image('disabledLevelBtn', 'assets/images/disabledLevelBtn.png');
        this.load.spritesheet('item1', 'assets/images/item1.png',32,32);
        this.load.spritesheet('heartbeat', 'assets/images/heartbeat.png',256, 256);
        this.load.image('healthbar', 'assets/images/healthbar_green.png');
        this.load.spritesheet('numbers', 'assets/images/numbers.png',32,32);
        this.load.image('invisible', 'assets/images/invisible.png');
        this.load.image('stink', 'assets/images/stink.png');
        this.load.image('pausedBtn', 'assets/images/pausedBtn.png');
        this.load.image('pausedBtnCard', 'assets/images/pausedBtnCard.png');
        this.load.image('resetIcon', 'assets/images/resetIcon.png');
        this.load.spritesheet('settingsBtn', 'assets/images/settingsBtn.png', 110, 60);
        this.load.image('settingIcon', 'assets/images/settingIcon.png');
        this.load.image('cancelIcon', 'assets/images/cancelIcon.png');
        this.load.image('saveIcon', 'assets/images/saveIcon.png');
        this.load.image('okIcon', 'assets/images/okIcon.png');
        this.load.spritesheet('backBtn', 'assets/images/backBtn.png', 110, 60);
        this.load.image('mainMenuIcon', 'assets/images/mainMenuIcon.png');
        this.load.image('nextIcon', 'assets/images/nextIcon.png');
        this.load.spritesheet('mainMenuBtn', 'assets/images/mainMenuBtn.png', 130, 30);
        this.load.spritesheet('gameStatusBtn', 'assets/images/gameStatusBtn.png', 110, 60);
        this.load.spritesheet('robot', 'assets/images/robot.png',166,200);
        this.load.spritesheet('drone', 'assets/images/drone.png',256,256);

        this.load.tilemap('map1', 'assets/js/test.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('map2', 'assets/js/test2.json', null, Phaser.Tilemap.TILED_JSON);
        
        this.load.tilemap('lvl1', 'assets/js/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('lvl2', 'assets/js/level2.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.atlasJSONArray('hand', 'assets/images/hand.png', 'assets/js/hand.json');
        this.load.atlasJSONArray('arm', 'assets/images/arm.png', 'assets/js/arm.json');
        this.load.atlasJSONArray('enemy1', 'assets/images/enemy1.png', 'assets/js/enemy1.json');

        this.load.spritesheet('pipe', 'assets/images/pipe.png', 64, 16);
        this.load.image('hold', 'assets/images/hold.png');
        this.load.image('tileset', 'assets/images/tileset.png');
        this.load.image('tileset2', 'assets/images/tileset2.png');
        
    },

    create: function () {
        this.state.start("MainMenu");
        
    }

}


