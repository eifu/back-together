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
        this.initItem();
        this.initText();
        this.initEnemies();

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
                cancelBtn.destroy();
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
        this.physics.arcade.collide(this.item, platformLayer);
        
        this.physics.arcade.collide(this.enemies, platformLayer);
        this.physics.arcade.collide(this.player, this.enemies, this.playerDamaged, null, this);


        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
        
        for(var i = 0; i < this.item.length; i++){
            this.item.children[i].frame = 0;
        }
        
        this.physics.arcade.overlap(this.player, this.item, this.propUser, null, this);

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
            // this.player.animations.stop();
        }

        //  Allow the player to jump if they are touching the ground.
        if (keys['UP'].isDown && this.player.body.blocked.down) {
            // when using tilemap, body.touching does not work. so instead, using body.blocked.down.
            this.player.body.velocity.y = -350;
        }
        
        for(var i = 0; i < this.item.length; i++){
        if(this.item.children[i].held){
            this.item.children[i].body.y = this.player.body.y;
            this.item.children[i].body.x = this.player.body.x - this.pipe1.offset*(7/10);
            this.item.children[i].holdTime+=.166;
        }
        
        else{
            this.item.children[i].releaseTime+=.166;
        }
            
        this.item.children[i].holdbox1 = this.item.children[i].body.x;
        this.item.children[i].holdbox2 = this.item.children[i].body.x + this.item.children[i].body.width;

    }
        
        if (keys['SPACE'].isDown) {

            pausedLayer = map.createLayer('pausedLayer');
            pausedLayer.resizeWorld();
            pausedLayer.alpha = 0.6;
            game.paused = true;

            pausedBtnCard = game.add.sprite(game.camera.view.centerX, game.camera.view.centerY, 'pausedBtnCard')
            pausedBtnCard.anchor.setTo(0.5, 0.5);
            pausedBtnCard.scale.setTo(2.5, 2.5);

            cancelBtn = game.add.button(game.camera.view.centerX + 235 , game.camera.view.centerY-110, 'cancelIcon', resumeOnClick, this,2,1,0);
            cancelBtn.anchor.setTo(0.5,0.5);
            cancelBtn.scale.setTo(0.3,0.3);

            pausedBtnCardText = game.add.text(game.camera.view.centerX, game.camera.view.centerY + 260, 'Press Spacebar to resume', { font: '32px Aclonica', fill: '#FFF' });
            pausedBtnCardText.anchor.setTo(0.5, 0.5);

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
            resetIcon.scale.setTo(0.8, 0.8);


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
            function resumeOnClick(){
                pausedLayer.destroy();
                cancelBtn.destroy();
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

        this.updateEnemies();
    },
    collectStar: function (player, star) {

        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;

    },
    propUser: function(){
        for(var i = 0; i < this.item.length; i++){
        if(!this.item.children[i].held){
        this.item.children[i].frame = 1;
        }
        if(this.cursors.down.isDown){
            if(!this.item.children[i].held &&  this.item.children[i].releaseTime > 10){
                this.item.children[i].held = true;
                this.item.children[i].frame = 0;
                this.item.children[i].body.gravity.y = 0;
                this.item.children[i].frame = 0;
                this.item.children[i].releaseTime = 0;
                this.item.children[i].holdTime = 0;
                var dist1 = Math.abs(this.player.body.x - this.item.children[i].holdbox1);
                var dist2 = Math.abs(this.player.body.x - this.item.children[i].holdbox2);
                
                if(dist2 < dist1){
                    this.item.children[i].offset = this.item.children[i].body.width;
                }
                else{
                    this.item.children[i].offset = 0;
                }
            }
            else{
                if(this.item.children[i].holdTime > 10){
                    this.item.children[i].held = false;
                    this.item.children[i].frame = 1;
                    this.item.children[i].body.gravity.y = 300;
                    this.item.children[i].releaseTime = 0;
                    this.item.children[i].holdTime = 0;
                }
            }
        
        }
        }
    },
    
    initItem: function(){
        this.item = this.add.group();

        //  enable physics for pipe
        this.item.enableBody = true;
        
        this.pipe1 = this.item.create(300, 100, 'pipe');
        this.pipe1.body.gravity.y = 300;
        this.pipe1.body.bounce.y = .1;
        this.pipe1.held = false;
        this.pipe1.releaseTime = 0;
        this.pipe1.holdbox1 = this.pipe1.body.x;
        this.pipe1.holdbox2 = this.pipe1.body.x + this.pipe1.body.width;
    },
    playerDamaged: function () {
        if (this.player.damagedTime < this.time.now) {

            console.log('damaged');
            this.player.damagedTime = this.time.now + 1000;

        }

    },
    playerDamaged: function () {
        if (this.player.damagedTime < this.time.now) {

            console.log('damaged');
            this.player.damagedTime = this.time.now + 1000;

        }
    },
    initPlayer: function () {
        // The player and its settings
        this.player = this.add.sprite(this.world.centerX, this.world.centerY - 150, 'hand');

        //  We need to enable physics on the player
        this.physics.arcade.enable(this.player);



        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;

        // this.player.animations.add('left', [
        // 'hand_left',
        // ], 10, true, false);

        this.player.animations.add('left', Phaser.Animation.generateFrameNames('hand_left', 1, 6), 10, true);
        this.player.animations.add('right', Phaser.Animation.generateFrameNames('hand_right', 1, 5), 10, true);
        this.player.animations.add('left_damaged', Phaser.Animation.generateFrameNames('hand_left_damaged', 1, 4), 10, true);
        this.player.animations.add('right_damaged', Phaser.Animation.generateFrameNames('hand_right_damaged', 1, 4), 10, true);
        this.player.animations.add('dying', Phaser.Animation.generateFrameNames('dying', 1, 12), 10, true);

        // this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.camera.follow(this.player);

        this.player.damaged = false;
        this.player.damagedTime = 0;
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
    initEnemies: function () {

        this.enemies = this.add.group()
        this.enemies.enableBody = true;

        this.enemy1 = this.enemies.create(64 * 1 + 16, 64 * 8 + 16, 'enemy');
        this.enemy1.animations.add('left', [0, 1, 2, 3], 10, true);
        this.enemy1.animations.add('right', [5, 6, 7, 8], 10, true);
        this.enemy1.animations.play('right');
        this.enemy1.body.velocity.x = 100;

        this.enemy2 = this.enemies.create(64 * 7 + 16, 64 * 8 + 16, 'enemy');
        this.enemy2.animations.add('left', [0, 1, 2, 3], 10, true);
        this.enemy2.animations.add('right', [5, 6, 7, 8], 10, true);
        this.enemy2.animations.play('right');
        this.enemy2.body.velocity.x = 100;

        this.enemy3 = this.enemies.create(64 * 13 + 16, 64 * 6 + 16, 'enemy');
        this.enemy3.animations.add('left', [0, 1, 2, 3], 10, true);
        this.enemy3.animations.add('right', [5, 6, 7, 8], 10, true);
        this.enemy3.animations.play('right');
        this.enemy3.body.velocity.x = 100;

    },
    updateEnemies: function () {

        if (this.enemy1.body.x < 64 * 1 + 2) {
            this.enemy1.animations.play('right')
            this.enemy1.body.velocity.x = 100;
        } else if (this.enemy1.body.x > 64 * 3 + 32 - 2) {
            this.enemy1.animations.play('left');
            this.enemy1.body.velocity.x = -100;
        }

        if (this.enemy2.body.x < 64 * 7 + 2) {
            this.enemy2.animations.play('right');
            this.enemy2.body.velocity.x = 100;
        } else if (this.enemy2.body.x > 64 * 8 + 32 - 2) {
            this.enemy2.animations.play('left');
            this.enemy2.body.velocity.x = -100;
        }

        if (this.enemy3.body.x < 64 * 13 + 2) {
            this.enemy3.animations.play('right');
            this.enemy3.body.velocity.x = 100;
        } else if (this.enemy3.body.x > 64 * 16 + 32 - 2) {
            this.enemy3.animations.play('left');
            this.enemy3.body.velocity.x = -100;
        }
    }

}
