BackTogether.Level1 = function (game) {

};


var platformLayer;
var pausedLayer;
var invincibilityOn = false;
var keys;
var iKeyDown = false;
var playAgain;
var mainMenu;
var next;
var player;
var playerStartPos;
var playerEndPos;
var map;
var itemBox;
var gameItems;
var popup = false;
var pauseScreenBtns;

BackTogether.Level1.prototype = {

    create: function (game) {
        game.physics.startSystem(Phaser.Physics.P2JS);

        WebFont.load(wfconfig);
        this.stage.backgroundColor = "#3A5963";
        map = this.add.tilemap('lvl1', 64, 64);
        map.addTilesetImage('tileset2');

        platformLayer = map.createLayer('platformLayer');
        platformLayer.resizeWorld();

        map.setCollisionBetween(1, 8);
        // setCollisionBetween takes two indexes, starting and ending position.
        // BlackTile is at 1st position, RedTile is at 2nd position,
        // (1,1) makes only BlackTile collidable.

        this.score = 0;

        this.physics.p2.convertTilemap(map, platformLayer);

        this.physics.p2.restitution = 0;
        this.physics.p2.gravity.y = 300;

        this.initPlayer();
        // this.initItems();
        this.initText();
        this.initHealthBar();
        this.initRobots();
        this.initItemBox();

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
            Phaser.Keyboard.P,
            Phaser.Keyboard.I
        ];
        var name = [
            'ONE', 'TWO', 'UP', 'LEFT', 'RIGHT', 'DOWN', 'SPACE', 'W', 'A', 'S', 'D', 'O', 'P', 'I'
        ]      
        
        keys = {};
        inputs.forEach(function (input, i) {
            keys[name[i]] = game.input.keyboard.addKey(input);
        });
        
        keys['SPACE'].onDown.add(this.unpause, game);

        
        var volIcon = this.add.sprite(this.camera.view.centerX + game.width / 2.5, this.camera.view.centerY + game.height / 2.5, icon);
        volIcon.anchor.setTo(0.5, 0.5);
        
        var volBtn = game.add.button(this.camera.view.centerX + game.width / 2.5, this.camera.view.centerY + game.height / 2.5, 'volBtn', function () {
            if(!volumeOn){
                icon = 'volDownIcon';
                volIcon.loadTexture(icon);
                volumeOn = !volumeOn;
                music.mute = true;
                pop.mute = true;
                crash.mute = true;
            }
            else{
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
        
        this.initObjectiveScreen(game);

    },
    
    unpause: function() {
            // Only act if paused  
            if (this.paused && !popup) {
                pausedLayer.destroy();
                cancelBtn.destroy();
                pausedBtnCard.destroy();
                pausedBtnCardText.destroy();
                resetBtn.destroy();
                resetIcon.destroy();
                mmBtn.destroy();
                mmIcon.destroy();
                inventoryBtn.destroy();
                inventoryTxt.destroy();

                for (var i = 0; i < player.itemBtns.length; i++) {
                    player.itemBtns[i].destroy();
                }
                for (var i = 0; i < player.itemNums.length; i++) {
                    player.itemNums[i].destroy();
                }
                player.itemBtns = [];
                player.itemNums = [];

                // Unpause the game
                this.paused = false;
            }
        },

    update: function (game) {
        //  Reset the players velocity (movement)
        player.body.velocity.x = 0;

        if (this.time.now < player.damagedTime) {
            if (player.face == 'left') {
                player.animations.play('left_damaged')
                player.body.velocity.x = 100;
            } else {
                player.animations.play("right_damaged")
                player.body.velocity.x = -100;
            }

            player.damaged = true;

        } else {
//            if (this.checkOverlap(player, this.robots)) {
//                if(!invincibilityOn){
//                this.screenShake();
//                this.playerDamaged();
//                }
//                else{
//                    this.robot1.switchedOff = true;
//                }
//            
                var tempThis = this;
                this.robots.children.forEach(function (r) {
                 if(tempThis.checkOverlap(player, r)){
                     if(!r.switchedOff && !r.vulnerable && !invincibilityOn){
                         tempThis.screenShake();
                         tempThis.playerDamaged();
                     }
                     else {
                         if(!r.switchedOff){
                             message = "CONGRATULATIONS! \n You just defeated your first evil robot!"
                             tempThis.congratsCardPopup(game, message);
                         }
                         r.switchedOff = true;
                     }
                 }   
                });
            
            
//            for(var i = 0; i < this.robots.children.length; i++){
//                if(this.checkOverlap(player, this.robots.children[i])){
//                    if(!this.robots.children[i].switchedOff && !this.robots.children[i].vulnerable){
//                        this.screenShake();
//                        this.player.Damaged();
//                    }
//                    else{
//                        this.robots.children[i].switchedOff = true;
//                    }
//                    }
//                }

            if (keys['LEFT'].isDown || keys['A'].isDown) {
                //  Move to the left
                if (player.animations.frame == 1) {
                    player.body.velocity.x = -800;
                } else {
                    player.body.velocity.x = 0;
                }
                player.animations.play('left');
                player.face = 'left';
            }
            else if (keys['RIGHT'].isDown || keys['D'].isDown) {
                //  Move to the right
                if (player.animations.frame == 5) {
                    player.body.velocity.x = 800;
                } else {
                    player.body.velocity.x = 0;
                }
                player.animations.play('right');
                player.face = 'right';
            } else {

                if (player.damaged && player.face == 'left') {
                    player.animations.play('left');
                    player.animations.stop();
                    player.damaged = false;
                } else if (player.face == 'left') {
                    player.animations.stop();
                } else if (player.damaged && player.face == 'right') {
                    player.animations.play('right');
                    player.animations.stop();
                    player.damaged = false;
                } else if (player.face == 'right') {
                    player.animations.stop();
                }
            }
        }

        if (keys['SPACE'].isDown) {
            this.initPausedScreen(game);
        }

        if (keys['O'].isDown) {
            this.game.state.start('WinScreen');
        }

        if (keys['P'].isDown) {
            this.game.state.start('LoseScreen');
        }
        
        if(keys['TWO'].isDown){
            Level = 'TWO';
            this.game.state.start('Level2');
        }
        
        if(keys['I'].isDown && !iKeyDown){
            iKeyDown = true;
            if(!invincibilityOn){
                invincibilityOn = true;
            }
            else{
                invincibilityOn = false;
            }
        }
        if(keys['I'].isUp){
            iKeyDown = false;
        }

        this.playerVictory();
        this.updateRobots();
        this.playerAttack();
        
//        player.items = { 'invisible': 2, 'stink': 1 };
        this.collectItem(player, itemBox, game);
    },
        collectItem: function(obj1, obj2, game){
            if(this.checkOverlap(obj1, obj2)){
            if(!obj2.taken){
                obj2.taken = true;
                obj2.visible = false;
                
                //player.items will change to gameItems whenever we create more than 2 items
                var randomItem = Math.floor((Math.random() * Object.keys(obj1.items).length));
                var item = gameItems[randomItem];
                player.items[item]++;
                
                // rest of the code in this collectItem should only be for level 1 after player got his/her very first game item ever
                var message = "CONGRATULATIONS! \n You just received your first game item! \n After clicking OK, Press spacebar\n to view inventory."
                this.congratsCardPopup(game, message);
            }
        }
    },
    
    congratsCardPopup: function(game, message){
        popup = true;
        var congratsCard = this.add.sprite(this.camera.view.centerX, this.camera.view.centerY, 'congratsCard')
        congratsCard.anchor.setTo(0.5, 0.5);
        congratsCard.scale.setTo(7, 4);
        congratsCardText = this.add.text(this.camera.view.centerX, this.camera.view.centerY - congratsCard.height/3, message, { font: '32px Aclonica', fill: '#FFF' });
        congratsCardText.anchor.setTo(0.5, 0);
        
        okBtn = this.add.button(this.camera.view.centerX, this.camera.view.centerY + congratsCard.height/3, 'okBtn', function(){
            congratsCard.destroy();
            okBtn.destroy();
            okIcon.destroy();
            congratsCardText.destroy();
            console.log("a");
            game.paused = false;
            popup = false;
        }, game, 2, 1, 0);
        okBtn.anchor.setTo(0.5, 0.5);
        okBtn.scale.setTo(4, 4);
            
        okIcon = this.add.sprite(this.camera.view.centerX, this.camera.view.centerY + congratsCard.height/3, 'okIcon');
        okIcon.anchor.setTo(0.5, 0.5);
        game.world.bringToTop(okIcon);
        game.paused = true;
    },

    checkOverlap: function (spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);

    },
    screenShake: function () {
        this.camera.shake(0.01, 100);
    },
    
    playerAttack: function(){
        this.robots.children.forEach(function (r) {
        if(player.body.x < r.x && player.body.velocity.x >= 0 && r.body.velocity.x >= 0 || r.switchedOff){
            r.vulnerable = true;
        }
        else if(player.body.x > r.x && player.body.velocity.x <= 0 && r.body.velocity.x <= 0 || r.switchedOff){
            r.vulnerable = true;
        }
        else{
            r.vulnerable = false;
        }
        }
    )},

    propUser: function () {
        for (var i = 0; i < this.item.length; i++) {
            if (!this.item.children[i].held) {
                this.item.children[i].frame = 1;
            }
        }
        if (keys['DOWN'].isDown || keys['S'].isDown) {
            if (!this.item.children[i].held && this.item.children[i].releaseTime > 10) {
                this.item.children[i].held = true;
                this.item.children[i].frame = 0;
                this.item.children[i].body.gravity.y = 0;
                this.item.children[i].frame = 0;
                this.item.children[i].releaseTime = 0;
                this.item.children[i].holdTime = 0;
                var dist1 = Math.abs(player.body.x - this.item.children[i].holdbox1);
                var dist2 = Math.abs(player.body.x - this.item.children[i].holdbox2);

                if (dist2 < dist1) {
                    this.item.children[i].offset = this.item.children[i].body.width;
                }
                else {
                    this.item.children[i].offset = 0;
                }
            }
            else {
                if (this.item.children[i].holdTime > 10) {
                    this.item.children[i].held = false;
                    this.item.children[i].frame = 1;
                    this.item.children[i].body.gravity.y = 300;
                    this.item.children[i].releaseTime = 0;
                    this.item.children[i].holdTime = 0;
                }


            }
        }
    },
    playerDamaged: function () {
        if (player.damagedTime < this.time.now) {
            crash.play();
            player.damagedTime = this.time.now + 1000;
            if (player.face == 'left') {
                player.face = 'left_damagd';
            } else {
                player.face = 'right_damaged';
            }
            this.healthPoint -= 1;
            if (this.healthPoint == 0) {
                this.game.state.start('LoseScreen');
            } else if (this.healthPoint < 2) {
                this.heart.animations.play("quick");
            } else if (this.healthPoint < 4) {
                this.heart.animations.play("normal");
            } else {
                this.heart.animations.play("slow");
            }

            this.healthbar.scale.setTo(1, this.healthPoint);
        }

    },
    initItems: function () {
        this.items = this.add.group();

        this.items.enableBody = true;

        this.pipe1 = this.items.create(300, 100, 'pipe');

        this.pipe1.body.gravity.y = 300;
        this.pipe1.body.bounce.y = .1;
        this.pipe1.held = false;
        this.pipe1.releaseTime = 0;
        this.pipe1.holdbox1 = this.pipe1.body.x;
        this.pipe1.holdbox2 = this.pipe1.body.x + this.pipe1.body.width;
        this.pipe1.type = "item";


    },
    initItemBox: function(){
        var itemBoxPos = this.findObjectsByType('itemBox', map, 'objectsLayer');
        itemBox = this.add.sprite(itemBoxPos[0].x, itemBoxPos[0].y, 'itemBox');
        itemBox.taken = false;
        itemBox.animations.add('normal', [0, 1, 2, 3], 10, true);
        itemBox.animations.play('normal');
    },
    
    initPlayer: function () {
        // The player and its settings
        playerStartPos = this.findObjectsByType('playerStart', map, 'objectsLayer')
        playerEndPos = this.findObjectsByType('playerEnd', map, 'objectsLayer');
        player = this.add.sprite(playerStartPos[0].x, playerStartPos[0].y, 'hand');

        //  We need to enable physics on the player
        this.physics.p2.enable(player, true);

        player.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 5), 10, true);
        player.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 5), 10, true);
        player.animations.add('left_damaged', Phaser.Animation.generateFrameNames('left_damaged', 1, 2), 10, true);
        player.animations.add('right_damaged', Phaser.Animation.generateFrameNames('right_damaged', 1, 2), 10, true);


        player.animations.play('left');
        player.face = 'left';

        player.body.clearShapes();
        player.body.addPolygon({}, [[1, 42], [1, 29], [32, 20], [63, 29], [63, 42]]);


        this.camera.follow(player);

        player.damaged = false;
        player.damagedTime = 0;

        // player.items = ['invisible', 'stink', 'invisible'];
        player.items = { 'invisible': 2, 'stink': 1 };
        player.itemBtns = [];
        player.itemNums = [];
        
        gameItems = [];
        gameItems.push('invisible');
        gameItems.push('stink');
    },
    initText: function () {
        // the level
        this.levelText = this.add.text(100, 70, 'Level:' + Level, { font: '32px Aclonica', fill: '#000' });

        //  The score
        this.scoreText = this.add.text(100, 100, 'Score: 0', { font: '32px Aclonica', fill: '#000' });
        this.levelText.fixedToCamera = true;
        this.scoreText.fixedToCamera = true;
    },

    findObjectsByType: function (type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function (element) {
            if (element.properties.type === type) {
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;

    },

    initEnemies: function () {

        this.enemies = this.add.group();


        this.enemy1 = this.enemies.create(64 * 1 + 16, -50, 'enemy1');
        this.physics.p2.enable(this.enemy1, true);
        this.enemy1.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 2), 10, true);
        this.enemy1.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 2), 10, true);
        this.enemy1.body.clearShapes();
        this.enemy1.body.addRectangle(86, 256, 5, 11);
        this.enemy1.body.addRectangle(86, 256, 5, 11);
        this.enemy1.body.addRectangle(55, 241, 60, 213, 0);
        this.enemy1.body.addRectangle(55, 241, -30, 203, 0);
        this.enemy1.body.fixedRotation = true;



        this.enemy2 = this.enemies.create(64 * 7 + 16, 0, 'enemy1');
        this.physics.p2.enable(this.enemy2, true);
        this.enemy2.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 2), 10, true);
        this.enemy2.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 2), 10, true);
        this.enemy2.animations.play('right');
        this.enemy2.body.clearShapes();
        this.enemy2.body.addRectangle(86, 256, 5, 11);
        this.enemy2.body.addRectangle(55, 241, 60, 213, 0);
        this.enemy2.body.addRectangle(55, 241, -30, 203, 0);
        this.enemy2.body.fixedRotation = true;

        this.enemy3 = this.enemies.create(64 * 13 + 16, 0, 'enemy1');
        this.physics.p2.enable(this.enemy3, true);
        this.enemy3.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 2), 10, true);
        this.enemy3.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 2), 10, true);
        this.enemy3.animations.play('right');
        this.enemy3.body.clearShapes();
        this.enemy3.body.addRectangle(86, 256, 5, 11);
        this.enemy3.body.addRectangle(55, 241, 60, 213, 0);
        this.enemy3.body.addRectangle(55, 241, -30, 203, 0);
        this.enemy3.body.fixedRotation = true;

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
    },
    initDrones:function(){
        this.drones = this.add.group();
        _drone1Start = this.findObjectsByType('drone1Start', map, 'objectsLayer')
        _drone1Left = this.findObjectsByType('drone1Left', map, 'objectsLayer')
        _drone1Right = this.findObjectsByType('drone1Right', map, 'objectsLayer');

        this.drone1 = this.factoryDrone(_drone1Start[0].x, _drone1Start[0].y);
        this.drone1.leftPos = _drone1Left;
        this.drone1.rightPos = _drone1Right;

        this.camera.follow(this.drone1);

    },

    factoryDrone: function(x,y){
        var d = this.drones.create(x,y,'drone');
        this.physics.p2.enable(d, true);
        d.animations.add('left', [0, 1], 10, true);
        d.animations.add('left_damaged', [2, 3], 10, true)
        d.animations.add('right', [4, 5], 10, true);
        d.animations.add("right_damaged", [6, 7], 10, true);

        d.animations.play("left");
        d.face = 'left';
    },

    updateDrones:function(){
        this.drones.children.forEach(function(d){
            if (d.state == 'patrol'){
                // goomba
                if (d.body.x < d.leftPos){
                    d.face = 'right';
                    d.body.moveRight(100);

                } else if (d.leftPos < d.body.x < d.rightPos){
                    if (d.face == "left"){
                        d.body.moveLeft(100);
                    }else{
                        d.body.moveRight(100);
                    }
                }
                
                else {
                    d.face = 'left';
                    d.body.moveLeft(100);
                }

            }else{
                // trace player
            }
        })
    },

    initRobots: function () {
        this.robots = this.add.group();

        _robot1Start = this.findObjectsByType('robot1Start', map, 'objectsLayer')
        _robot1Left = this.findObjectsByType('robot1Left', map, 'objectsLayer')
        _robot1Right = this.findObjectsByType('robot1Right', map, 'objectsLayer');

        this.robot1 = this.factoryRobot(_robot1Start[0].x, _robot1Start[0].y);
        this.robot1.robot1Left = _robot1Left;
        this.robot1.robot1Right = _robot1Right
    },

    factoryRobot: function (x, y) {
        var r = this.robots.create(x, y, 'robot');
        this.physics.p2.enable(r, true);
        r.animations.add('right_attack', [0, 1], 10, true);
        r.animations.add('right', [2, 3], 10, true)
        r.animations.add('left_attack', [4, 5], 10, true);
        r.animations.add("left", [6, 7], 10, true);

        r.animations.play("left");
        r.face = 'left';

        r.body.clearShapes();

        r.body.addCircle(24, 0, -76);
        r.body.addRectangle(59, 90, 0, -8);
        r.body.addRectangle(155, 55, 0, 67);

        r.body.velocity.x = 100;
        r.body.velocity.y = 0;

        r.states = [['left', 'idle'], ['left', 'left'],
        ['right', 'idle'], ['right', 'right'],
        ['idle', 'idle'], ['idle', 'left'], ['idle', 'right']];
        r.state = 'idle';
        r.switchedOff = false;
        r.vulnerable = false;
        return r;
    },
    updateRobots: function () {

        var timeNow = this.time.now;

        this.robots.children.forEach(function (r) {
            if(!r.switchedOff){
            if (r.state == "left") {
                if (timeNow < r.stateTime) {
                    r.body.velocity.x = -25;
                    r.animations.play('left');
                } else {
                    r.face = 'left';
                    r.state = 'idle';
                }
            } else if (r.state == "right") {
                if (timeNow < r.stateTime) {
                    r.body.velocity.x = 25;
                    r.animations.play("right");
                } else {
                    r.face = 'right';
                    r.state = 'idle';
                }
            } else if (r.state == 'idle') {
                if (Math.random() < 0.1) {
                    if (Math.random() < 0.5) {
                        r.state = 'left';
                        r.face = 'left';
                        r.stateTime = timeNow + 1000;
                    } else {
                        r.state = 'right';
                        r.state = 'right';
                        r.stateTime = timeNow + 1000;
                    }
                } else {
                    r.animations.stop();

                    if (r.face == 'left') {
                        r.animations.frame = 2;
                    } else {
                        r.animations.frame = 6;
                    }

                }
            }
            }
            else{
                r.body.velocity.x = 0;
                r.animations.frame = 0;
            }
        })
    },

    initPausedScreen: function (game) {
        pauseScreenBtns = [];
        
        pausedLayer = map.createLayer('pausedLayer');
        pausedLayer.resizeWorld();
        pausedLayer.alpha = 0.6;
        game.paused = true;

        pausedBtnCard = this.add.sprite(this.camera.view.centerX, this.camera.view.centerY, 'pausedBtnCard')
        pausedBtnCard.anchor.setTo(0.5, 0.5);
        pausedBtnCard.scale.setTo(2.5, 2.5);

        cancelBtn = this.add.button(this.camera.view.centerX + 235, this.camera.view.centerY - 110, 'cancelIcon', this.resumeOnClick, game, 2, 1, 0);
        cancelBtn.anchor.setTo(0.5, 0.5);
        cancelBtn.scale.setTo(0.3, 0.3);
        pauseScreenBtns.push(cancelBtn);

        pausedBtnCardText = this.add.text(this.camera.view.centerX, this.camera.view.centerY + 260, 'Press Spacebar to resume', { font: '32px Aclonica', fill: '#FFF' });
        pausedBtnCardText.anchor.setTo(0.5, 0.5);

        mmBtn = this.add.button(this.camera.view.centerX - 134, this.camera.view.centerY + 55, 'pausedBtn', function(){
        pausedLayer.destroy();
        cancelBtn.destroy();
        pausedBtnCard.destroy();
        pausedBtnCardText.destroy();
        resetBtn.destroy();
        resetIcon.destroy();
        mmBtn.destroy();
        mmIcon.destroy();
        inventoryBtn.destroy();
        inventoryTxt.destroy();

        for (var i = 0; i < player.itemBtns.length; i++) {
            player.itemBtns[i].destroy();
        }
        for (var i = 0; i < player.itemNums.length; i++) {
            player.itemNums[i].destroy();
        }

        player.itemBtns = [];
        player.itemNums = [];

        // Unpause the game
        this.paused = false;
            
        game.state.start('MainMenu')}, game, 2, 1, 0);
        
        mmBtn.anchor.setTo(0.5, 0.5);
        mmBtn.scale.setTo(1.6, 1.6);
        pauseScreenBtns.push(mmBtn);

        mmIcon = this.add.sprite(this.camera.view.centerX - 134, this.camera.view.centerY + 55, 'mainMenuIcon');
        mmIcon.anchor.setTo(0.5, 0.5);
        mmIcon.scale.setTo(0.8, 0.8);


        resetBtn = this.add.button(this.camera.view.centerX - 134, this.camera.view.centerY - 55, 'pausedBtn', this.resetOnClick, game, 2, 1, 0);
        resetBtn.anchor.setTo(0.5, 0.5);
        resetBtn.scale.setTo(1.6, 1.6);
        pauseScreenBtns.push(resetBtn);

        resetIcon = this.add.sprite(this.camera.view.centerX - 134, this.camera.view.centerY - 55, 'resetIcon');
        resetIcon.anchor.setTo(0.5, 0.5);
        resetIcon.scale.setTo(0.8, 0.8);


        inventoryBtn = this.add.image(this.camera.view.centerX + 79, this.camera.view.centerY, 'pausedBtn');
        inventoryBtn.anchor.setTo(0.5, 0.5);
        inventoryBtn.scale.setTo(3.8, 3.8);

        inventoryTxt = this.add.text(this.camera.view.centerX + 79, this.camera.view.centerY - 68, 'inventory', { font: '32px Aclonica', fill: '#000' });
        inventoryTxt.anchor.setTo(0.5, 0.5);

        var i = 0;
        for (var key in player.items) {
            if (!player.items.hasOwnProperty(key)) continue;

            var obj = player.items[key];

            var x = this.camera.view.centerX + i * 32;
            var y = this.camera.view.centerY - 58 + i + 32
            
//            var invenTemp = this.inventoryItemOnClick(key, game);

            var item1 = this.add.button(x, y, key, this.inventoryItemOnClick, this, 2, 1, 0);
            item1.anchor.setTo(0.5, 0.5);
            player.itemBtns.push(item1);
            pauseScreenBtns.push(item1);

            var num = this.add.text(x + 16, y + 16, obj, { font: '32px Aclonica', fill: '#000' });
            num.anchor.setTo(0.5, 0.5);
            num.scale.setTo(0.5, 0.5);
            player.itemNums.push(num);

            i += 1;
        }

    },
    
        initObjectiveScreen: function (game) {
        popup = true;
        objectiveCard = this.add.sprite(this.camera.view.centerX, this.camera.view.centerY + game.world.height/3, 'objectiveCard')
        objectiveCard.anchor.setTo(0.5, 0.5);
        objectiveCard.scale.setTo(7, 4);
        objectiveCardText = this.add.text(this.camera.view.centerX, this.camera.view.centerY + 260, 'Objective: \n ASSASSINATION STYLE ... \n When the robot turns around, \n run against its butt.\n There is a switch to turn it off.', { font: '32px Aclonica', fill: '#FFF' });
        objectiveCardText.anchor.setTo(0.5, 0);

        okBtn = this.add.button(this.camera.view.centerX, this.camera.view.centerY + 550, 'okBtn', function(){
            objectiveCard.destroy();
            okBtn.destroy();
            okIcon.destroy();
            objectiveCardText.destroy();
            this.paused = false;
            popup = false;
        }, game, 2, 1, 0);
        okBtn.anchor.setTo(0.5, 0.5);
        okBtn.scale.setTo(4, 4);
            
        okIcon = this.add.sprite(this.camera.view.centerX, this.camera.view.centerY + 550, 'okIcon');
        okIcon.anchor.setTo(0.5, 0.5);
        game.world.bringToTop(okIcon);
        game.paused = true;
    },
    
    initConfirmItem(item, message, game){
        for(var i = 0 ; i < pauseScreenBtns.length; i++){
            pauseScreenBtns[i].inputEnabled = false;
        }
        
        popup = true;
        var confirmCard = this.add.sprite(this.camera.view.centerX, this.camera.view.centerY, 'objectiveCard');
        confirmCard.anchor.setTo(0.5, 0.5);
        confirmCard.scale.setTo(7, 4);
        
        var image = this.add.sprite(this.camera.view.centerX, this.camera.view.centerY - confirmCard.height/4, item);
        image.anchor.setTo(0.5, 0.5);
        image.scale.setTo(3, 3);
        
        var confirmCardText = this.add.text(this.camera.view.centerX, this.camera.view.centerY, message, { font: '32px Aclonica', fill: '#FFF' });
        confirmCardText.anchor.setTo(0.5, 0);
        
//        var tempThis = this;
        
        var okBtn = this.add.button(this.camera.view.centerX - confirmCard.width/5, this.camera.view.centerY + confirmCard.height/3, 'yesBtn', function(){
            confirmCard.destroy();
            noBtn.destroy();
            noIcon.destroy();
            okBtn.destroy();
            okIcon.destroy();
            image.destroy();
            confirmCardText.destroy();
            game.paused = false;
            popup = false;
            player.items[item]--;
            
            for(var i = 0 ; i < pauseScreenBtns.length; i++){
            pauseScreenBtns[i].inputEnabled = true;
        }
        }, game, 2, 1, 0);
        okBtn.anchor.setTo(0.5, 0.5);
        okBtn.scale.setTo(4, 4);
            
        var okIcon = this.add.sprite(this.camera.view.centerX- confirmCard.width/5, this.camera.view.centerY + confirmCard.height/3, 'okIcon');
        okIcon.anchor.setTo(0.5, 0.5);
        this.world.bringToTop(okIcon);
        
        var noBtn = this.add.button(this.camera.view.centerX + confirmCard.width/5, this.camera.view.centerY + confirmCard.height/3, 'noBtn', function(){
            confirmCard.destroy();
            noBtn.destroy();
            noIcon.destroy();
            okBtn.destroy();
            okIcon.destroy();
            image.destroy();
            confirmCardText.destroy();
            popup = false;
        for(var i = 0 ; i < pauseScreenBtns.length; i++){
            pauseScreenBtns[i].inputEnabled = true;
        }
//            this.game.paused = false;
//            popup = false;
        }, this, 2, 1, 0);
        noBtn.anchor.setTo(0.5, 0.5);
        noBtn.scale.setTo(4, 4);
            
        var noIcon = this.add.sprite(this.camera.view.centerX + confirmCard.width/5, this.camera.view.centerY + confirmCard.height/3, 'cancelIcon');
        noIcon.anchor.setTo(0.5, 0.5);
        noIcon.scale.setTo(1.25, 1.25);
        this.world.bringToTop(noIcon);
    },
    
    resetOnClick: function () {
        this.score = 0;
        this.state.restart();
        this.paused = false;
    },
    restartLvl: function () {
        this.game.state.start('LevelSelecting');
    },
    returnMM: function () {
        game.state.start('MainMenu');
//        console.log(game.state);
    },
    nextLvl: function () {
        console.log("to be implemented");
    },

    resumeOnClick: function () {
        pausedLayer.destroy();
        cancelBtn.destroy();
        pausedBtnCard.destroy();
        pausedBtnCardText.destroy();
        resetBtn.destroy();
        resetIcon.destroy();
        mmBtn.destroy();
        mmIcon.destroy();
        inventoryBtn.destroy();
        inventoryTxt.destroy();

        for (var i = 0; i < player.itemBtns.length; i++) {
            player.itemBtns[i].destroy();
        }
        for (var i = 0; i < player.itemNums.length; i++) {
            player.itemNums[i].destroy();
        }

        player.itemBtns = [];
        player.itemNums = [];

        // Unpause the game
        this.paused = false;
    },
    inventortOnClick: function () {
        inventoryTxt.visible = !inventoryTxt.visible;
        item1.visible = !item1.visible;
    },
    inventoryItemOnClick: function (e, game) {
//        console.log('inventory item pressed');
        var message = "Ahhh ... " + e.key +  "!\n Want to use it?";
        
        this.initConfirmItem(e.key, message, game);
    },
    playerVictory: function () {
        if (playerEndPos[0].x - 5 < player.body.x && playerEndPos[0].x + 5 > player.body.x) {
            console.log("victory!");
        }
    },
    initHealthBar: function () {

        this.healthPoint = 6;

        this.healthbar = this.add.image(this.camera.view.width - 120, 120, 'healthbar');
        this.healthbar.anchor.setTo(0, 0);
        this.healthbar.scale.setTo(1, this.healthPoint);
        this.healthbar.fixedToCamera = true;


        // console.log(this.camera.view);
        this.heart = this.add.sprite(this.camera.view.width - 80, 120, 'heartbeat');
        this.heart.anchor.setTo(0.5, 0.5);

        this.heart.animations.add('normal', [0, 1, 2, 3, 4, 5], 10, true);

        this.heart.animations.add('slow', [0, 0, 1, 2, 3, 3, 4, 5], 10, true);
        this.heart.animations.add('quick', [0, 2, 4, 5], 10, true);

        this.heart.animations.play('slow');

        this.heart.fixedToCamera = true;



    }

}
