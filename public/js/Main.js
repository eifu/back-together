Game.Main = function (game) {

};

var map;
var platformLayer;
var pausedLayer;
var keys;

Game.Main.prototype = {

    create: function (game) {
        WebFont.load(wfconfig);
        this.stage.backgroundColor = "#3A5963";

        map = this.add.tilemap('map', 64, 64);
        map.addTilesetImage('tileset');
        platformLayer = map.createLayer('platformLayer');
        platformLayer.resizeWorld();
        map.setCollisionBetween(1, 1)
        // setCollisionBetween takes two indexes, starting and ending position.
        // BlackTile is at 1st position, RedTile is at 2nd position, 
        // (1,1) makes only BlackTile collidable.

        this.score = 0;

        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.initPlayer();
        this.initStars();
        this.initText();

        //  Our controls.
        this.cursors = this.input.keyboard.createCursorKeys();
        var inputs = [
            Phaser.Keyboard.UP,
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.SPACEBAR,
        ];
        var name = [
            'UP', 'LEFT', 'RIGHT', 'SPACE'
        ]

        keys = {};
        inputs.forEach(function (input, i) {
            keys[name[i]] = game.input.keyboard.addKey(input);
        });

        keys['SPACE'].onDown.add(unpause, self);

        function unpause(event) {
            // Only act if paused
            if (game.paused) {
                pausedLayer.destroy();

                pausedBtnCard.destroy();
                pausedBtnCardText.destroy();
                resetBtn.destroy();
                resetIcon.destroy();
                settingBtn.destroy();
                settingIcon.destroy();
                inventoryBtn.destroy();
                inventoryTxt.destroy();
                // Unpause the game
                game.paused = false;
            }
        }

    },

    update: function (game) {


        this.physics.arcade.collide(this.player, platformLayer);
        this.physics.arcade.collide(this.stars, platformLayer);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);

        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

        if (keys['LEFT'].isDown) {
            //  Move to the left
            this.player.body.velocity.x = -150;

            this.player.animations.play('left');
        }
        else if (keys['RIGHT'].isDown) {
            //  Move to the right
            this.player.body.velocity.x = 150;

            this.player.animations.play('right');
        }
        else {
            //  Stand still
            this.player.animations.stop();

            this.player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (keys['UP'].isDown && this.player.body.blocked.down) {
            // when using tilemap, body.touching does not work. so instead, using body.blocked.down.
            this.player.body.velocity.y = -350;
        }

        if (keys['SPACE'].isDown) {

            pausedLayer = map.createLayer('pausedLayer');
            pausedLayer.resizeWorld();
            pausedLayer.alpha = 0.6;
            game.paused = true;

            pausedBtnCard = game.add.sprite(game.camera.view.centerX, game.camera.view.centerY, 'pausedBtnCard')
            pausedBtnCard.anchor.setTo(0.5, 0.5);
            pausedBtnCard.scale.setTo(2.5, 2.5);

            pausedBtnCardText = game.add.text(game.camera.view.centerX, game.camera.view.centerY+260, 'Press Spacebar to resume',{ font: '32px Aclonica', fill: '#FFF' });
            pausedBtnCardText.anchor.setTo(0.5,0.5);

            settingBtn = game.add.button(game.camera.view.centerX - 134, game.camera.view.centerY + 55, 'pausedBtn', settingOnClick, this, 2, 1, 0);
            settingBtn.anchor.setTo(0.5, 0.5);
            settingBtn.scale.setTo(1.6, 1.6);

            settingIcon = game.add.sprite(game.camera.view.centerX - 134, game.camera.view.centerY + 55, 'settingIcon');
            settingIcon.anchor.setTo(0.5, 0.5);
            settingIcon.scale.setTo(0.8, 0.8);


            resetBtn = game.add.button(game.camera.view.centerX - 134, game.camera.view.centerY - 55, 'pausedBtn', resetOnClick, this, 2, 1, 0);
            resetBtn.anchor.setTo(0.5, 0.5);
            resetBtn.scale.setTo(1.6, 1.6);

            resetIcon = game.add.sprite(game.camera.view.centerX - 134, game.camera.view.centerY - 55, 'resetIcon');
            resetIcon.anchor.setTo(0.5, 0.5);
            resetIcon.scale.setTo(0.8,0.8);


            inventoryBtn = game.add.image(game.camera.view.centerX + 79, game.camera.view.centerY, 'pausedBtn');
            inventoryBtn.anchor.setTo(0.5, 0.5);
            inventoryBtn.scale.setTo(3.8, 3.8);

            inventoryTxt = game.add.text(game.camera.view.centerX + 79, game.camera.view.centerY, 'inventory', { font: '32px Aclonica', fill: '#000' });
            inventoryTxt.anchor.setTo(0.5, 0.5);

            function resetOnClick(event) {
                this.score = 0;
                game.state.restart();
                game.paused = false;
            }
            function settingOnClick() {
                console.log('setting button clicked');
            }

        }
    },
    collectStar: function (player, star) {

        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;

    },
    initPlayer: function () {
        // The player and its settings
        this.player = this.add.sprite(this.world.centerX, this.world.centerY - 150, 'dude');

        //  We need to enable physics on the player
        this.physics.arcade.enable(this.player);

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.camera.follow(this.player);

    },
    initStars: function () {
        //  Finally some stars to collect
        this.stars = this.add.group();

        //  We will enable physics for any star that is created in this group
        this.stars.enableBody = true;

        //  Here we'll create 12 of them evenly spaced apart
        for (var i = 0; i < 12; i++) {
            //  Create a star inside of the 'stars' group
            var star = this.stars.create(i * 70, 0, 'star');

            //  Let gravity do its thing
            star.body.gravity.y = 300;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }
    },
    initText: function () {
        // the level 
        this.levelText = this.add.text(100, 70, 'Level:' + Level, { font: '32px Aclonica', fill: '#000' });

        //  The score
        this.scoreText = this.add.text(100, 100, 'Score: 0', { font: '32px Aclonica', fill: '#000' });
        this.levelText.fixedToCamera = true;
        this.scoreText.fixedToCamera = true;
    },


}