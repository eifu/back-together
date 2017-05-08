
Arm = {
 initPlayer: function (game) {
        // The player and its settings
        playerStartPos = Tile.findObjectsByType('playerStart', map, 'objectsLayer')
        playerEndPos = Tile.findObjectsByType('playerEnd', map, 'objectsLayer');
        player = game.add.sprite(playerStartPos[0].x, playerStartPos[0].y, 'arm');

        //  We need to enable physics on the player
        game.physics.p2.enable(player, true);

        player.animations.add('left', Phaser.Animation.generateFrameNames('left', 1, 5), 10, true);
        player.animations.add('right', Phaser.Animation.generateFrameNames('right', 1, 5), 10, true);
        player.animations.add('left_damaged', Phaser.Animation.generateFrameNames('left_damaged', 1, 2), 10, true);
        player.animations.add('right_damaged', Phaser.Animation.generateFrameNames('right_damaged', 1, 2), 10, true);


        player.animations.play('left');
        player.face = 'left';

        player.body.clearShapes();
        // player.body.addPolygon({}, [[0,54],[128,54],[112,-10],[16,-10]]);
        player.body.addRectangle(128, 30, 0, 10);
        player.body.addRectangle(80, 70, 0, -10);


        game.camera.follow(player);

        player.damaged = false;
        player.damagedTime = 0;

        // player.items = ['invisible', 'stink', 'invisible'];
        player.items = { 'invisible': 2, 'stink': 1 };
        player.itemBtns = [];
        player.itemNums = [];

    },
}