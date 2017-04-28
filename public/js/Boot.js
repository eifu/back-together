var BackTogether = {};

BackTogether.Boot = function(game){};


BackTogether.Boot.prototype = {
    init:function(){

        this.MaxPointer = 1  // if it is mobile game, it could be more than 1.

        this.disableVisiblityChange = true; 
        
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

    },

    preload:function(){
        
        this.load.image("preloadBar", "assets/images/preloadBar.png");
        this.load.spritesheet('robot', 'assets/images/robot.png',166,200);
        this.load.spritesheet('drone', 'assets/images/drone.png',256,256);
        this.load.image('splashHand', 'assets/images/SplashHand.png');
        this.load.atlasJSONArray('enemy1', 'assets/images/enemy1.png', 'assets/js/enemy1.json');
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

    create: function(){
        this.state.start("Preloader");
    }
}