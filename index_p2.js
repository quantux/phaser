var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var map;
var layer;
var level1_shapes;
var player;
var cursors;

function preload() {
    game.load.tilemap('tilemap', 'assets/tileset.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/Tiles_64x64.png');
    game.load.image('dude', 'assets/phaser-dude.png');
}

function create() {

    game.physics.startSystem(Phaser.Physics.P2JS);

    game.stage.backgroundColor = "#DDDDDD";

    map = game.add.tilemap('tilemap');
    map.addTilesetImage('Tiles_64x64', 'tiles');

    game.physics.p2.convertCollisionObjects(map, "shapes");

    layer = map.createLayer('level1');
    layer.resizeWorld();

    //map.setCollisionBetween(1, 25, 26);
    
    // Converts polygons into physical bodies
    game.physics.p2.convertTilemap(map, layer);

    player = game.add.sprite(32, 32, 'dude');

    game.physics.p2.enable(player);
    game.physics.p2.gravity.y = 250;

    player.body.linearDamping = 1;
    player.body.collideWorldBounds = true;
    player.body.fixedRotation = true;

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    player.body.velocity.x = 0;

    if (cursors.up.isDown){
        if(touchingDown(player)){  // this checks if the player is on the floor (we don't allow airjumps)
            player.body.velocity.y = -200;   // change the y velocity to -800 means "jump!"
        }
    }


    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;
    }

}

function touchingDown(someone) {
    var yAxis = p2.vec2.fromValues(0, 1);
    var result = false;
    for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
        var c = game.physics.p2.world.narrowphase.contactEquations[i];  // cycles through all the contactEquations until it finds our "someone"
        if (c.bodyA === someone.body.data || c.bodyB === someone.body.data)        {
            var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
            if (c.bodyA === someone.body.data) d *= -1;
            if (d > 0.5) result = true;
        }
    } return result;
}


