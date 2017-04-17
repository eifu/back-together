BackTogether.WinScreen = function (game) {

};


BackTogether.WinScreen.prototype = {

    create: function (game) {
        var winLayer = map.createLayer('pausedLayer');

        var replayBtn = this.add.button(this.camera.view.centerX - 200, this.camera.view.centerY + 100, 'gameStatusBtn', replayOnClick, this, 2, 1, 0);
        replayBtn.anchor.setTo(0.5, 0.5);
        replayBtn.scale.setTo(1.6, 1.6);

        var replayIcon = this.add.sprite(this.camera.view.centerX - 200, this.camera.view.centerY + 100, 'resetIcon');
        replayIcon.anchor.setTo(0.5, 0.5);
        replayIcon.scale.setTo(0.8, 0.8);


        var menuBtn = this.add.button(this.camera.view.centerX, this.camera.view.centerY + 100, 'gameStatusBtn', mainMenuOnClick, this, 2, 1, 0);
        menuBtn.anchor.setTo(0.5, 0.5);
        menuBtn.scale.setTo(1.6, 1.6);

        var menuIcon = this.add.sprite(this.camera.view.centerX, this.camera.view.centerY + 100, 'mainMenuIcon');
        menuIcon.anchor.setTo(0.5, 0.5);
        menuIcon.scale.setTo(0.8, 0.8);
        
        var nextBtn = this.add.button(this.camera.view.centerX + 200, this.camera.view.centerY + 100, 'gameStatusBtn', nextLvlOnClick, this, 2, 1, 0);
        nextBtn.anchor.setTo(0.5, 0.5);
        nextBtn.scale.setTo(1.6, 1.6);

        var nextIcon = this.add.sprite(this.camera.view.centerX + 200, this.camera.view.centerY + 100, 'nextIcon');
        nextIcon.anchor.setTo(0.5, 0.5);
        nextIcon.scale.setTo(0.8, 0.8);
        
        var txt = game.add.text(this.camera.view.centerX, 50, "YOU WON", {
            font: '60px Aclonica', fill: "#F00",
            align: "center"
        });
        txt.anchor.setTo(0.5, 0.5);
        
        function replayOnClick(){
            game.state.start('Level1');
        }
        function mainMenuOnClick(){
            game.state.start('MainMenu');
        }
        function nextLvlOnClick(){
            var currIndex = itoaArray.indexOf(Level);
            if(currIndex < 16){
                currIndex++;
            }
            Level = itoaArray[currIndex];
            
            game.state.start('Level1');
        }
    }
}


