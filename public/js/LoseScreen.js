BackTogether.LoseScreen = function (game) {

};


BackTogether.LoseScreen.prototype = {
    
    create: function (game) {
        var loseLayer = map.createLayer('pausedLayer');

        var replayBtn = this.add.button(this.camera.view.centerX - 200, this.camera.view.centerY + 100, 'gameStatusBtn', replay, this, 2, 1, 0);
        replayBtn.anchor.setTo(0.5, 0.5);
        replayBtn.scale.setTo(1.6, 1.6);

        var replayIcon = this.add.sprite(this.camera.view.centerX - 200, this.camera.view.centerY + 100, 'resetIcon');
        replayIcon.anchor.setTo(0.5, 0.5);
        replayIcon.scale.setTo(0.8, 0.8);


        var menuBtn = this.add.button(this.camera.view.centerX , this.camera.view.centerY + 100, 'gameStatusBtn', mainMenu, this, 2, 1, 0);
        menuBtn.anchor.setTo(0.5, 0.5);
        menuBtn.scale.setTo(1.6, 1.6);

        var menuIcon = this.add.sprite(this.camera.view.centerX , this.camera.view.centerY + 100, 'mainMenuIcon');
        menuIcon.anchor.setTo(0.5, 0.5);
        menuIcon.scale.setTo(0.8, 0.8);
        
        var txt = game.add.text(this.camera.view.centerX, 50, "YOU'VE LOST", {
            font: '60px Aclonica', fill: "#F00",
            align: "center"
        });
        txt.anchor.setTo(0.5, 0.5);
        
        function replay(){
            game.state.start('Level1');
        }
        function mainMenu(){
            game.state.start('MainMenu');
        }
    }

}


