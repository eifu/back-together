

var PausedScreen = function (game, player) {

    this.player = player;
    this.game = game;

    this.pausedLayer = map.createLayer('pausedLayer');
    this.pausedLayer.resizeWorld();
    this.pausedLayer.alpha = 0.6;
    game.paused = true;
    this.pauseBool = true;




    this.sprite = game.add.sprite(game.camera.view.centerX, game.camera.view.centerY, 'pausedBtnCard')
    this.sprite.anchor.setTo(0.5, 0.5);
    this.sprite.scale.setTo(2.5, 2.5);

    this.pauseScreenBtns = [];
    this.itemBtns = [];
    this.itemNums = [];



    this.off = function () {

        this.pauseBool = false;

        this.pausedLayer.visible = false;
        this.cancelBtn.visible = false;
        this.sprite.visible = false;
        this.txt.visible = false;
        this.resetBtn.visible = false;
        this.resetIcon.visible = false;
        this.mmBtn.visible = false;
        this.mmIcon.visible = false;
        this.inventory.visible = false;
        this.inventoryTxt.visible = false;

        for (var i = 0; i < this.itemBtns.length; i++) {
            this.itemBtns[i].visible = false;;
            this.itemNums[i].visible = false;;
        }

        this.game.paused = false;
    }



    this.cancelBtn = game.add.button(0, 0, 'cancelIcon', this.off, this, 2, 1, 0);
    this.cancelBtn.anchor.setTo(0.5, 0.5);
    this.cancelBtn.scale.setTo(0.3, 0.3);
    this.pauseScreenBtns.push(this.cancelBtn);

    this.txt = game.add.text(0, 0, 'Press Spacebar to resume', { font: '32px Aclonica', fill: '#FFF' });
    this.txt.anchor.setTo(0.5, 0.5);

    this.mmBtn = game.add.button(0, 0, 'pausedBtn', function () {

        this.game.paused = false;

        this.game.state.start('MainMenu')
    }, this, 2, 1, 0);

    this.mmBtn.anchor.setTo(0.5, 0.5);
    this.mmBtn.scale.setTo(1.6, 1.6);
    this.pauseScreenBtns.push(this.mmBtn);

    this.mmIcon = game.add.sprite(0, 0, 'mainMenuIcon');
    this.mmIcon.anchor.setTo(0.5, 0.5);
    this.mmIcon.scale.setTo(0.8, 0.8);

    this.resetOnClick = function () {
        this.game.state.restart();
        this.game.paused = false;
    };

    this.resetBtn = game.add.button(0, 0, 'pausedBtn', this.resetOnClick, this, 2, 1, 0);
    this.resetBtn.anchor.setTo(0.5, 0.5);
    this.resetBtn.scale.setTo(1.6, 1.6);
    this.pauseScreenBtns.push(this.resetBtn);

    this.resetIcon = game.add.sprite(0, 0, 'resetIcon');
    this.resetIcon.anchor.setTo(0.5, 0.5);
    this.resetIcon.scale.setTo(0.8, 0.8);


    this.inventory = game.add.image(0, 0, 'pausedBtn');
    this.inventory.anchor.setTo(0.5, 0.5);
    this.inventory.scale.setTo(3.8, 3.8);

    this.inventoryTxt = game.add.text(0, 0, 'inventory', { font: '32px Aclonica', fill: '#000' });
    this.inventoryTxt.anchor.setTo(0.5, 0.5);

    var i = 0;


    this.inventortOnClick = function () {
        inventoryTxt.visible = !inventoryTxt.visible;
        item1.visible = !item1.visible;
    };

    this.inventoryItemOnClick = function (e, game) {
        for (var i = 0; i < this.pauseScreenBtns.length; i++) {
            this.pauseScreenBtns[i].inputEnabled = false;
        }

        this.confirmBool = true;
        this.confirmScreen.on();
        this.confirmScreen.setText("Ahhh ... " + e.key + "!\n Want to use it?");
        this.confirmScreen.setItem(e.key);

    };

    // console.log("96");
    // console.log(this.player.items);
    for (var key in this.player.items) {
        if (!this.player.items.hasOwnProperty(key)) continue;

        var obj = this.player.items[key];

        var item1 = game.add.button(0, 0, key, this.inventoryItemOnClick, this, 2, 1, 0);
        item1.anchor.setTo(0.5, 0.5);
        this.itemBtns.push(item1);
        this.pauseScreenBtns.push(item1);

        var num = game.add.text(0, 0, obj, { font: '32px Aclonica', fill: '#000' });
        num.anchor.setTo(0.5, 0.5);
        num.scale.setTo(0.5, 0.5);
        this.itemNums.push(num);

        i += 1;
    }


    this.on = function () {

        // stop game time.
        this.game.paused = true;

        // this is for Spacebar
        this.pauseBool = true;

        this.pausedLayer.visible = true;

        this.cancelBtn.visible = true;
        this.cancelBtn.reset(this.game.camera.view.centerX + 235, this.game.camera.view.centerY - 110);
        this.game.world.bringToTop(this.cancelBtn);

        this.sprite.visible = true;
        this.sprite.reset(this.game.camera.view.centerX, this.game.camera.view.centerY);
        this.game.world.bringToTop(this.sprite);

        this.txt.visible = true;
        this.txt.reset(this.game.camera.view.centerX, this.game.camera.view.centerY + 260);
        this.game.world.bringToTop(this.txt);

        this.resetBtn.visible = true;
        this.resetBtn.reset(game.camera.view.centerX - 134, game.camera.view.centerY - 55);
        this.game.world.bringToTop(this.resetBtn);

        this.resetIcon.visible = true;
        this.resetIcon.reset(game.camera.view.centerX - 134, game.camera.view.centerY - 55);
        this.game.world.bringToTop(this.resetIcon);

        this.mmBtn.visible = true;
        this.mmBtn.reset(this.game.camera.view.centerX - 134, this.game.camera.view.centerY + 55);
        this.game.world.bringToTop(this.mmBtn);

        this.mmIcon.visible = true;
        this.mmIcon.reset(this.game.camera.view.centerX - 134, this.game.camera.view.centerY + 55);
        this.game.world.bringToTop(this.mmIcon);

        this.inventory.visible = true;
        this.inventory.reset(this.game.camera.view.centerX + 79, this.game.camera.view.centerY);
        this.game.world.bringToTop(this.inventory);

        this.inventoryTxt.visible = true;
        this.inventoryTxt.reset(this.game.camera.view.centerX + 79, this.game.camera.view.centerY - 68);
        this.game.world.bringToTop(this.inventoryTxt);

        console.log(187);
        console.log(this.itemBtns);
        for (var i = 0; i < this.itemBtns.length; i++) {
            var x = this.game.camera.view.centerX + i * 32;
            var y = this.game.camera.view.centerY - 58 + i + 32;
            this.itemBtns[i].visible = true;
            this.itemBtns[i].reset(x, y);
            this.game.world.bringToTop(this.itemBtns[i]);

            // console.log(this.itemBtns[i]);
            // console.log(this.player.items[this.selectedItem]);
            this.itemNums[i].setText(this.player.items[this.itemBtns[i].key]);      // we need to update here.
            this.itemNums[i].visible = true;
            this.game.world.bringToTop(this.itemNums[i]);

            this.itemNums[i].reset(x + 16, y + 16);
        }


    }

    this.confirmScreen = new ConfirmScreen(game, "", this);
    this.confirmScreen.off();
    this.confirmBool = false;

    this.confirmOff = function () {
        this.confirmScreen.off();
        this.confirmBool = false;
        this.pauseBool = true;
    }

}