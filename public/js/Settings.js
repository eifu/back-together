BackTogether.Settings = function (game) {

};


BackTogether.Settings.prototype = {

    create: function (game) {

        // TODO: we need to find a way to initialize the background.
        // var settingsLayer = map.createLayer('pausedLayer');
        game.stage.backgroundColor = "#570e28";

        var menuBtn = this.add.button(this.camera.view.centerX - 200, this.camera.view.centerY + game.height/2.5, 'settingsBtn', mainMenuOnClick, this, 2, 1, 0);
        menuBtn.anchor.setTo(0.5, 0.5);
        menuBtn.scale.setTo(1.6, 1.6);

        var menuIcon = this.add.sprite(this.camera.view.centerX - 200, this.camera.view.centerY + game.height/2.5, 'mainMenuIcon');
        menuIcon.anchor.setTo(0.5, 0.5);
        menuIcon.scale.setTo(0.8, 0.8);


        var saveBtn = this.add.button(this.camera.view.centerX, this.camera.view.centerY + game.height/2.5, 'settingsBtn', saveOnClick, this, 2, 1, 0);
        saveBtn.anchor.setTo(0.5, 0.5);
        saveBtn.scale.setTo(1.6, 1.6);

        var saveIcon = this.add.sprite(this.camera.view.centerX, this.camera.view.centerY + game.height/2.5, 'saveIcon');
        saveIcon.anchor.setTo(0.5, 0.5);
        saveIcon.scale.setTo(0.8, 0.8);
        
        var okBtn = this.add.button(this.camera.view.centerX + 200, this.camera.view.centerY + game.height/2.5, 'settingsBtn', okOnClick, this, 2, 1, 0);
        okBtn.anchor.setTo(0.5, 0.5);
        okBtn.scale.setTo(1.6, 1.6);

        var okIcon = this.add.sprite(this.camera.view.centerX + 200, this.camera.view.centerY + game.height/2.5, 'okIcon');
        okIcon.anchor.setTo(0.5, 0.5);
        okIcon.scale.setTo(0.8, 0.8);
        
        var txt = game.add.text(this.camera.view.centerX, 50, "CHANGE SETTINGS", {
            font: '60px Aclonica', fill: "#F00",
            align: "center"
        });
        txt.anchor.setTo(0.5, 0.5);
        
        var inputs = [
            Phaser.Keyboard.ONE,
            Phaser.Keyboard.TWO,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.DOWN,
            Phaser.Keyboard.SPACEBAR,
            Phaser.Keyboard.W,
            Phaser.Keyboard.A,
            Phaser.Keyboard.S,
            Phaser.Keyboard.D,
            Phaser.Keyboard.O,
            Phaser.Keyboard.P
        ];
        var name = [
            'ONE', 'TWO', 'UP', 'LEFT', 'RIGHT', 'DOWN', 'SPACE', 'W', 'A', 'S', 'D', 'O', 'P'
        ]      
        
        keys = {};
        inputs.forEach(function (input, i) {
            keys[name[i]] = game.input.keyboard.addKey(input);
        });
        
        function saveOnClick(){ // saves game
            
            // TO-DO: save current game settings to user data, once done saving, continue on with rest of code
            
            var saveTxt = game.add.text(this.camera.view.centerX, saveBtn.position.y - saveBtn.height, "Settings Saved!", {
            font: '32px Aclonica', fill: "#FFF",
            align: "center"
        });

        saveTxt.anchor.setTo(0.5, 0.5);
        saveTxt.alpha = 0;
        game.add.tween(saveTxt).to( { alpha: 1 }, 100, Phaser.Easing.Linear.None, true, 0, 0, true);
        }
        
        function mainMenuOnClick(){
            game.state.start('MainMenu');   // goes to main menu
        }
        function okOnClick(){
            game.state.start('MainMenu');   // goes to main menu for now, but later implementation, asks user to save changes first
        }
},
    update: function(){
        if(keys['ONE'].isDown){
            Level = 'ONE';
            this.game.state.start('Level1');
        }
        if(keys['TWO'].isDown){
            Level = 'TWO';
            this.game.state.start('Level2');
        }
    }
}



