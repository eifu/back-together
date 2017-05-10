var itemSelected = "not yet";

var ConfirmScreen = function (game, message, pausedScreen) {

    this.game = game;

    this.pausedScreen = pausedScreen; // this is bad design.

    this.sprite = game.add.sprite(game.camera.view.centerX, game.camera.view.centerY, 'confirmCard');
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.scale.setTo(7, 4);

    this.invisible = game.add.sprite(game.camera.view.centerX, game.camera.view.centerY - this.height / 4, "invisible");
    this.invisible.anchor.setTo(0.5, 0.5);
    this.invisible.scale.setTo(3, 3);
    this.invisible.visible = false;

    this.stink = game.add.sprite(game.camera.view.centerX, game.camera.view.centerY - this.height / 4, "stink");
    this.stink.anchor.setTo(0.5, 0.5);
    this.stink.scale.setTo(3, 3);
    this.stink.visible = false;

    this.txt = game.add.text(game.camera.view.centerX, game.camera.view.centerY, message, { font: '32px Aclonica', fill: '#FFF' });
    this.txt.anchor.setTo(0.5, 0);

    this.off = function () {
        this.sprite.visible = false;

        if (itemSelected == 'stink') {
            this.stink.visible = false;
        } else if (itemSelected == 'invisible') {
            this.invisible.visible = false;
        }

        this.txt.visible = false;
        this.okBtn.visible = false;
        this.okIcon.visible = false;
        this.noBtn.visible = false;
        this.noIcon.visible = false;
        for (var i = 0; i < this.pausedScreen.pauseScreenBtns.length; i++) {
            this.pausedScreen.pauseScreenBtns[i].inputEnabled = true;
        }


    }

    this.okBtn = game.add.button(game.camera.view.centerX - this.width / 5, game.camera.view.centerY + this.height / 3, 'yesBtn',
        function () {
            this.off();

            this.pausedScreen.confirmBool = false;

            console.log('yes');
        }, this, 2, 1, 0);
    this.okBtn.anchor.setTo(0.5, 0.5);
    this.okBtn.scale.setTo(4, 4);

    this.okIcon = game.add.sprite(game.camera.view.centerX - this.width / 5, game.camera.view.centerY + this.height / 3, 'okIcon');
    this.okIcon.anchor.setTo(0.5, 0.5);
    game.world.bringToTop(this.okIcon);

    this.noBtn = game.add.button(game.camera.view.centerX + this.width / 5, game.camera.view.centerY + this.height / 3, 'noBtn',
        function () {
            this.off();

            this.pausedScreen.confirmBool = false;

            console.log('no');

        }, this, 2, 1, 0);
    this.noBtn.anchor.setTo(0.5, 0.5);
    this.noBtn.scale.setTo(4, 4);

    this.noIcon = game.add.sprite(game.camera.view.centerX + this.width / 5, game.camera.view.centerY + this.height / 3, 'cancelIcon');
    this.noIcon.anchor.setTo(0.5, 0.5);
    this.noIcon.scale.setTo(1.25, 1.25);
    game.world.bringToTop(this.noIcon);




    this.on = function () {

        this.sprite.visible = true;
        this.sprite.reset(this.game.camera.view.centerX, this.game.camera.view.centerY);
        this.game.world.bringToTop(this.sprite);

        this.txt.visible = true;
        this.txt.reset(this.game.camera.view.centerX, this.game.camera.view.centerY);
        this.game.world.bringToTop(this.txt);

        this.okBtn.visible = true;
        this.okBtn.reset(this.game.camera.view.centerX - this.sprite.width / 5, this.game.camera.view.centerY + this.sprite.height / 3);
        this.game.world.bringToTop(this.okBtn);

        this.okIcon.visible = true;
        this.okIcon.reset(this.game.camera.view.centerX - this.sprite.width / 5, this.game.camera.view.centerY + this.sprite.height / 3);
        this.game.world.bringToTop(this.okIcon);

        this.noBtn.visible = true;
        this.noBtn.reset(this.game.camera.view.centerX + this.sprite.width / 5, this.game.camera.view.centerY + this.sprite.height / 3);
        this.game.world.bringToTop(this.noBtn);

        this.noIcon.visible = true;
        this.noIcon.reset(this.game.camera.view.centerX + this.sprite.width / 5, this.game.camera.view.centerY + this.sprite.height / 3);
        this.game.world.bringToTop(this.noIcon);


    };

    this.setText = function (m) {
        this.txt.setText(m);
    };

    this.setItem = function (i) {
        if (i == 'stink') {
            this.stink.visible = true;
            this.stink.reset(this.game.camera.view.centerX, this.game.camera.view.centerY - this.sprite.height / 4);
            this.game.world.bringToTop(this.stink);
            itemSelected = i;
        } else if (i == 'invisible') {
            this.invisible.visible = true;
            this.invisible.reset(this.game.camera.view.centerX, this.game.camera.view.centerY - this.sprite.height / 4);
            this.game.world.bringToTop(this.invisible);
            itemSelected = i;
        } else {
            console.log("there is bug");
        }

    }

}