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
    },

    create: function(){
        this.state.start("Preloader");
    }
}