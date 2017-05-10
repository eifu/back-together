

var GameScreenConfig = {
    

    initText: function (game) {
        // the level
        var levelText = game.add.text(100, game.height - 70, 'Level:' + Level, { font: '32px Aclonica', fill: '#000' });

        levelText.fixedToCamera = true;

        // toggle button for input.
        this.toggleInputBtnKeyboard = game.add.button(100, game.height - 140, 'toggleInputBtnKeyboard', this.toggleOnClick, this, 2, 1, 0);
        this.toggleInputBtnKeyboard.scale.setTo(0.5, 0.5);
        this.toggleInputBtnKeyboard.fixedToCamera = true;
        this.toggleInputBtnKeyboard.WASDIcon = game.add.image(240, game.height - 140, 'WASDIcon');
        this.toggleInputBtnKeyboard.WASDIcon.scale.setTo(0.5, 0.5);
        this.toggleInputBtnKeyboard.WASDIcon.fixedToCamera = true;
        this.toggleInputBtnKeyboard.cursorIcon = game.add.image(320, game.height - 140, 'cursorIcon');
        this.toggleInputBtnKeyboard.cursorIcon.scale.setTo(0.5, 0.5);
        this.toggleInputBtnKeyboard.cursorIcon.fixedToCamera = true;


        this.toggleInputBtnMouse = game.add.button(100, game.height - 140, 'toggleInputBtnMouse', this.toggleOnClick, this, 2, 1, 0);
        this.toggleInputBtnMouse.scale.setTo(0.5, 0.5);
        this.toggleInputBtnMouse.fixedToCamera = true;
        this.toggleInputBtnMouse.visible = false;
        this.toggleInputBtnMouse.mouseIcon = game.add.image(240, game.height - 140, 'mouseIcon');
        this.toggleInputBtnMouse.mouseIcon.scale.setTo(0.5, 0.5);
        this.toggleInputBtnMouse.mouseIcon.fixedToCamera = true;
        this.toggleInputBtnMouse.mouseIcon.visible = false;

    },
    toggleOnClick: function () {
        if (this.toggleInputBtnKeyboard.visible == true) {
            console.log('toggle keyboard turns Off');
        } else {
            console.log('toggle mouse turns off');
        }

        this.toggleInputBtnKeyboard.visible = !this.toggleInputBtnKeyboard.visible;
        this.toggleInputBtnKeyboard.WASDIcon.visible = !this.toggleInputBtnKeyboard.WASDIcon.visible;
        this.toggleInputBtnKeyboard.cursorIcon.visible = !this.toggleInputBtnKeyboard.cursorIcon.visible;

        this.toggleInputBtnMouse.visible = !this.toggleInputBtnMouse.visible;
        this.toggleInputBtnMouse.mouseIcon.visible = !this.toggleInputBtnMouse.mouseIcon.visible;

    },


    initVolIcon: function (game) {
        var volIcon = game.add.sprite(game.camera.view.centerX + game.width / 2.5, game.camera.view.centerY + game.height / 2.5, icon);
        volIcon.anchor.setTo(0.5, 0.5);

        var volBtn = game.add.button(game.camera.view.centerX + game.width / 2.5, game.camera.view.centerY + game.height / 2.5, 'volBtn', function () {
            if (!volumeOn) {
                icon = 'volDownIcon';
                volIcon.loadTexture(icon);
                volumeOn = !volumeOn;
                music.mute = true;
                pop.mute = true;
                crash.mute = true;
            }
            else {
                icon = 'volUpIcon';
                volIcon.loadTexture(icon);
                volumeOn = !volumeOn;
                music.mute = false;
                pop.mute = false;
                crash.mute = false;
            }
        }, 2, 1, 0);

        volBtn.anchor.setTo(0.5, 0.5);
        volBtn.width = 55;
        volBtn.height = 60;
        volBtn.fixedToCamera = true;
        volIcon.fixedToCamera = true;
        game.world.bringToTop(volIcon);
    },
    initHealthBar: function (game) {
        console.log(DIFFICULTY);
        if (DIFFICULTY == 'easy') {
            this.healthPoint = 20;
        } else if (DIFFICULTY== 'normal') {
            this.healthPoint = 10;
        } else {
            this.healthPoint = 5;
        }


        this.healthbar = game.add.image(game.camera.view.centerX - 200, game.height - 40, 'healthbar_green');
        this.healthbar.anchor.setTo(0, 0.5);
        this.healthbar.scale.setTo(this.healthPoint, 1);
        this.healthbar.fixedToCamera = true;

        this.healthbar.shadow = game.add.image(game.camera.view.centerX - 200, game.height - 40, 'healthbar_red');
        this.healthbar.shadow.anchor.setTo(0, 0.5);
        this.healthbar.shadow.scale.setTo(this.healthPoint, 1);
        this.healthbar.shadow.fixedToCamera = true;

        game.world.bringToTop(this.healthbar);

        // console.log(this.camera.view);
        this.heart = game.add.sprite(game.camera.view.centerX - 200, game.height - 40, 'heartbeat');
        this.heart.anchor.setTo(0.5, 0.5);

        this.heart.animations.add('normal', [0, 1, 2, 3, 4, 5], 10, true);

        this.heart.animations.add('slow', [0, 0, 1, 2, 3, 3, 4, 5], 10, true);
        this.heart.animations.add('quick', [0, 2, 4, 5], 10, true);

        this.heart.animations.play('slow');

        this.heart.fixedToCamera = true;



    },
    initObjective: function (game, obj) {
        this.objectiveTxt = game.add.text(game.camera.view.centerX + 100, game.height - 100, 'test', { font: '24px Aclonica', fill: '#000' });
        this.objectiveTxt.anchor.setTo(0.5, 0.5);
        this.objectiveTxt.fixedToCamera = true;
        this.objective = obj;

        console.log('119');
    },
    setObjective: function (m) {
        if (m == null) {
            this.objectiveTxt.setText(this.objective);
        } else {
            this.objectiveTxt.setText(m);
        }
    }





}