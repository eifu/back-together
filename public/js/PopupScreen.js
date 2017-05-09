
var PopupScreen = function (game, message) {

    this.game = game;

    this.popupBool = false;

    this.pausedLayer = map.createLayer('pausedLayer');
    this.pausedLayer.resizeWorld();
    this.pausedLayer.alpha = 0.6;


    this.sprite = game.add.sprite(game.camera.view.centerX, game.camera.view.centerY, 'popupCard')
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.scale.setTo(7, 4);
    this.txt = game.add.text(game.camera.view.centerX, game.camera.view.centerY - this.sprite.height / 3, message, { font: '32px Aclonica', fill: '#FFF' });
    this.txt.anchor.setTo(0.5, 0);

    this.off = function () {

        this.popupBool = false;

        this.pausedLayer.visible = false;
        this.sprite.visible = false;
        this.okBtn.visible = false;
        this.okIcon.visible = false;
        this.txt.visible = false;
        game.paused = false;
    }

    this.okBtn = game.add.button(game.camera.view.centerX, game.camera.view.centerY + this.sprite.height / 3, 'okBtn', this.off, this, 2, 1, 0);
    this.okBtn.anchor.setTo(0.5, 0.5);
    this.okBtn.scale.setTo(4, 4);

    this.okIcon = game.add.sprite(game.camera.view.centerX, game.camera.view.centerY + this.sprite.height / 3, 'okIcon');
    this.okIcon.anchor.setTo(0.5, 0.5);
    game.world.bringToTop(this.okIcon);
    game.paused = true;

    this.on = function () {

        console.log('40');

        this.pausedLayer.visible = true;
        this.sprite.visible = true;
        this.sprite.reset(this.game.camera.view.centerX, this.game.camera.view.centerY);
        this.okBtn.visible = true;
        this.okBtn.reset(this.game.camera.view.centerX, this.game.camera.view.centerY + this.sprite.height / 3);
        this.okIcon.visible = true;
        this.okIcon.reset(this.game.camera.view.centerX, this.game.camera.view.centerY + this.sprite.height / 3);
        this.txt.visible = true;
        this.txt.reset(game.camera.view.centerX, game.camera.view.centerY - this.sprite.height / 3);
        game.paused = true;
        this.popupBool = true;

        game.world.bringToTop(this.sprite);
        game.world.bringToTop(this.txt);
        game.world.bringToTop(this.okBtn);
        game.world.bringToTop(this.okIcon);
    }



    this.setText = function (m) {
        this.txt.setText(m);
    }
}