BackTogether.WinScreen = function (game) {

};


BackTogether.WinScreen.prototype = {

    create: function (game) {
        var winLayer = map.createLayer('pausedLayer');
        winLayer.resizeWorld();

        var replayBtn = this.add.button(this.camera.view.centerX - 200, window.innerHeight - 100, 'gameStatusBtn', replay, this, 2, 1, 0);
        replayBtn.anchor.setTo(0.5, 0.5);
        replayBtn.scale.setTo(1.6, 1.6);

        var replayIcon = this.add.sprite(this.camera.view.centerX - 200, window.innerHeight - 100, 'resetIcon');
        replayIcon.anchor.setTo(0.5, 0.5);
        replayIcon.scale.setTo(0.8, 0.8);


        var menuBtn = this.add.button(this.camera.view.centerX, window.innerHeight - 100, 'gameStatusBtn', mainMenu, this, 2, 1, 0);
        menuBtn.anchor.setTo(0.5, 0.5);
        menuBtn.scale.setTo(1.6, 1.6);

        var menuIcon = this.add.sprite(this.camera.view.centerX, window.innerHeight - 100, 'mainMenuIcon');
        menuIcon.anchor.setTo(0.5, 0.5);
        menuIcon.scale.setTo(0.8, 0.8);
        
        var nextBtn = this.add.button(this.camera.view.centerX + 200, window.innerHeight - 100, 'gameStatusBtn', nextLvl, this, 2, 1, 0);
        nextBtn.anchor.setTo(0.5, 0.5);
        nextBtn.scale.setTo(1.6, 1.6);

        var nextIcon = this.add.sprite(this.camera.view.centerX + 200, window.innerHeight - 100, 'nextIcon');
        nextIcon.anchor.setTo(0.5, 0.5);
        nextIcon.scale.setTo(0.8, 0.8);
        
        var txt = game.add.text(this.camera.view.centerX, 50, "YOU WON", {
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
        function nextLvl(){
            var currIndex = itoaArray.indexOf(Level);
            if(currIndex < 16){
                currIndex++;
            }
            Level = itoaArray[currIndex];
            
            game.state.start('Level1');
        }
    }
}


