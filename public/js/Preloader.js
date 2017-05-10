BackTogether.Preloader = function (game) {

};

var music;
var pop;
var volumeOn = false;
var icon = 'volUpIcon';

BackTogether.Preloader.prototype = {

        preload: function (game) {
                this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY + this.game.height / 3, "preloadBar");

                this.stage.backgroundColor = "#b71c1c";
                this.robot = this.add.sprite(this.game.world.centerX - this.game.width / 2, this.game.world.centerY - this.game.height / 4, 'splashRobot');
                this.robot.scale.setTo(2.5, 2.5);
                this.drone = this.add.sprite(this.game.world.centerX, this.game.world.centerY - this.game.height / 3, 'drone');
                this.drone.anchor.setTo(0.5);
                this.scientist = this.add.sprite(this.game.world.centerX + this.game.width / 3, this.game.world.centerY, 'enemy1');
                this.scientist.anchor.setTo(0.5, 0.5);
                this.splashHand = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'splashHand');
                this.splashHand.anchor.setTo(0.5, 0.5);
                this.splashHand.scale.setTo(5, 5);

                this.preloadBar.anchor.setTo(0.5, 0.5);
                this.preloadBar.scale.setTo(3, 1);
                this.time.advancedTiming = true;

                this.load.setPreloadSprite(this.preloadBar);

                // ICONs in general
                this.load.image('settingIcon', 'assets/images/settingIcon.png');
                this.load.image('cancelIcon', 'assets/images/cancelIcon.png');
                this.load.image('saveIcon', 'assets/images/saveIcon.png');
                this.load.image('resetIcon', 'assets/images/resetIcon.png');
                this.load.image('mainMenuIcon', 'assets/images/mainMenuIcon.png');
                this.load.image('nextIcon', 'assets/images/nextIcon.png');
                this.load.image('okIcon', 'assets/images/okIcon.png');
                this.load.image('mouseIcon', 'assets/images/mouseIcon.png');
                this.load.image('WASDIcon', 'assets/images/WASDIcon.png');
                this.load.image('cursorIcon', 'assets/images/cursorIcon.png');
                this.load.image('hackIcon', 'assets/images/hackIcon.png');
                this.load.spritesheet('arrowLeftIcon', 'assets/images/arrowLeftIcon.png', 96, 96);
                this.load.spritesheet('arrowRightIcon', 'assets/images/arrowRightIcon.png', 96, 96);


                // BUTTONs in general
                this.load.spritesheet('yesBtn', 'assets/images/yesBtn.png', 24, 24);
                this.load.spritesheet('settingsBtn', 'assets/images/settingsBtn.png', 110, 60);
                this.load.spritesheet('backBtn', 'assets/images/backBtn.png', 110, 60);
                this.load.spritesheet('mainMenuBtn', 'assets/images/mainMenuBtn.png', 130, 30);
                this.load.spritesheet('gameStatusBtn', 'assets/images/gameStatusBtn.png', 110, 60);
                this.load.image('pausedBtn', 'assets/images/pausedBtn.png');
                this.load.spritesheet('levelBtn', 'assets/images/levelBtn.png', 110, 60);
                this.load.image('disabledLevelBtn', 'assets/images/disabledLevelBtn.png');
                this.load.spritesheet('noBtn', 'assets/images/noBtn.png', 24, 24);
                this.load.spritesheet('okBtn', 'assets/images/okBtn.png', 24, 24);

                // CARDs in general
                this.load.image('menuBtnCard', 'assets/images/menuBtnCard.png');
                this.load.image('pausedBtnCard', 'assets/images/pausedBtnCard.png');
                this.load.image('popupCard', 'assets/images/popupCard.png');
                this.load.image('confirmCard', 'assets/images/confirmCard.png');


                // Game Assets
                this.load.spritesheet('hitBox', 'assets/images/hitBox.png', 64, 64);
                this.load.image('goal', 'assets/images/goal.png');
                this.load.spritesheet('capsule', 'assets/images/capsule.png', 50, 50);
                this.load.spritesheet('itemBox', 'assets/images/itemBox.png', 32, 32);
                this.load.image('invisible', 'assets/images/invisible.png');
                this.load.image('stink', 'assets/images/stink.png');
                this.load.spritesheet('droneLight', 'assets/images/droneLight.png', 100, 200);
                this.load.image('hidePopUp', 'assets/images/hidePopUp.png');
                this.load.image('bodyMap', 'assets/images/bodyMap.png');
                this.load.image('logo', 'assets/images/logo.jpg');



                // GAME SCREEN
                this.load.spritesheet('volBtn', 'assets/images/VolBtn.png', 24, 24);
                this.load.image('volDownIcon', 'assets/images/VolDownIcon.png');
                this.load.image('volUpIcon', 'assets/images/VolUpIcon.png');
                this.load.spritesheet('toggleInputBtnKeyboard', 'assets/images/toggleInputBtnKeyboard.png', 250, 100);
                this.load.spritesheet('toggleInputBtnMouse', 'assets/images/toggleInputBtnMouse.png', 250, 100);
                this.load.image('healthbar_green', 'assets/images/healthbar_green.png');
                this.load.image('healthbar_red', 'assets/images/healthbar_red.png');
                this.load.spritesheet('heartbeat', 'assets/images/heartbeat.png', 100, 100);
                this.load.image('bar', 'assets/images/bar.png');

                // this is for demo.
                this.load.tilemap('level1_stage3', 'assets/js/level1_stage3.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.tilemap('level1_stage2', 'assets/js/level1_stage2.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.tilemap('level1_stage1', 'assets/js/level1_stage1.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.tilemap('level2_stage1', 'assets/js/level2_stage0.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.tilemap('level2_stage2', 'assets/js/level2_stage2.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.tilemap('level2_stage3', 'assets/js/level2_stage3.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.tilemap('level3_stage1', 'assets/js/level3_stage1.json', null, Phaser.Tilemap.TILED_JSON);
                this.load.tilemap('level3_stage2', 'assets/js/level3_stage2.json', null, Phaser.Tilemap.TILED_JSON);

                this.load.image('tileset', 'assets/images/tileset.png');
                this.load.image('tileset2', 'assets/images/tileset2.png');
                this.load.image('tileset3', 'assets/images/tileset3.png');
                this.load.image('tileset4', 'assets/images/tileset4.png');
                this.load.image('tileset5', 'assets/images/tileset5.png');
                this.load.image('tileset6', 'assets/images/tileset6.png');

                // Sprite Animations with JSON file
                this.load.atlasJSONArray('hand', 'assets/images/hand.png', 'assets/js/hand.json');
                this.load.atlasJSONArray('arm', 'assets/images/arm.png', 'assets/js/arm.json');
                this.load.atlasJSONArray('robot', 'assets/images/robot.png', 'assets/js/robot.json');
                this.load.atlasJSONArray('torso', 'assets/images/torso.png', 'assets/js/torso.json');


                // AUDIOs in general
                this.load.audio('pop', ['assets/audio/pop.mp3', 'assets/audio/pop.ogg']);
                this.load.audio('bg', ['assets/audio/bgMusic.mp3', 'assets/audio/bgMusic.ogg']);
                this.load.audio('crash', ['assets/audio/crash.mp3', 'assets/audio/crash.ogg']);

        },

        create: function () {
                WebFont.load(wfconfig);
                music = this.add.audio('bg');
                music.loop = true;
                music.play();
                pop = this.add.audio('pop');
                crash = this.add.audio('crash');
                this.state.start("MainMenu");
        }



}


