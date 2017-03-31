Game.Main = function (game) {

};

var map;
var platformLayer;
var touching;

Game.Main.prototype = {

    create: function (game) {

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
        this.initPipe();
        this.initText();

        //  Our controls.
        this.cursors = this.input.keyboard.createCursorKeys();

    },

    update: function () {
        //  Collide the player and the stars with the platforms
        this.physics.arcade.collide(this.player, platformLayer);
        this.physics.arcade.collide(this.stars, platformLayer);
        this.physics.arcade.collide(this.pipe, platformLayer);
        
        this.pipe1.frame = 0;

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
        
        touching = this.physics.arcade.overlap(this.player, this.pipe, this.propUser, null, this);

        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown) {
            //  Move to the left
            this.player.body.velocity.x = -150;

            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown) {
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
        if (this.cursors.up.isDown && this.player.body.blocked.down) {
            // when using tilemap, body.touching does not work. so instead, using body.blocked.down.
            this.player.body.velocity.y = -350;
        }
        if(this.pipe1.held){
            this.pipe1.body.y = this.player.body.y;
            this.pipe1.body.x = this.player.body.x;
            this.pipe1.holdTime+=.166;
        }
        
        else{
            this.pipe1.releaseTime+=.166;
            console.log(this.pipe1.releaseTime);
        }

    },
    collectStar: function (player, star) {

        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;

    },
    propUser: function(){
        if(!this.pipe1.held){
        this.pipe1.frame = 1;
        }
        if(this.cursors.down.isDown){
            if(!this.pipe1.held && this.pipe1.releaseTime > 10){
                this.pipe1.held = true;
                this.pipe1.frame = 0;
                this.pipe1.body.x = this.player.x;
                this.pipe1.body.y = this.player.y;
                this.pipe1.body.gravity.y = 0;
                this.pipe1.frame = 0;
                this.pipe1.holdTime = 0;
            }
            else{
                if(this.pipe1.holdTime > 10){
                    this.pipe1.held = false;
                    this.pipe1.frame = 1;
                    this.pipe1.body.gravity.y = 300;
                    this.pipe1.releaseTime = 0;
                }
            }
        }
    },
    
    initPipe: function(){
        this.pipe = this.add.group();

        //  enable physics for pipe
        this.pipe.enableBody = true;
        
        this.pipe1 = this.pipe.create(300, 100, 'pipe');

            //  Let gravity do its thing
        this.pipe1.body.gravity.y = 300;

            //  This just gives each star a slightly random bounce value
        this.pipe1.body.bounce.y = .1;
        
        this.pipe1.held = false;
        this.pipe1.releaseTime = 0;
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
        this.levelText = this.add.text(100, 70, 'Level:' + Level, { fontSize: '32px', fill: '#000' });

        //  The score
        this.scoreText = this.add.text(100, 100, 'Score: 0', { fontSize: '32px', fill: '#000' });
        this.levelText.fixedToCamera = true;
        this.scoreText.fixedToCamera = true;
    },


}