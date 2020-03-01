var config = {
    type: Phaser.AUTO,
    width: 720,
    height: 1280,
    backgroundColor: '#fffdfc',
    parent: "gameContainer",
    physics: {
        default: 'matter',
        matter: {
         debug: true,
         gravity: {
          x: 0,
          y: 0
      }
        }},
    scene: {
        preload: preload,
        create: create,
        update: update,
        extend: {
          createHexes: createHexes,
          createHexes2: createHexes2
        }
    }
};

var game = new Phaser.Game(config);
var hexes;
var hexesArr = [];
var player;
var gameSpeed = 4;
var playerSpeed = gameSpeed - 1;
var hexPositions;
var spacebar;
var score = 0;
var debugText;
var graphics;
var self;


var timerEvent;

function preload ()
{
    this.load.image('hex', 'assets/hex240.png');
    this.load.image('player', 'assets/triangle.png');
}

function create ()
{
    self = this;
    hexes = this.add.group();
    //hexes = new Phaser.GameObjects.Group(game.scene);
    // 120 px/s

    player = this.matter.add.image(game.canvas.width/2, game.canvas.height/2, 'player');
    player.setBody(
      {type: 'polygon',
        sides: 3,
        radius: player.width
      }
    );
    player.angle = 30;
    player.setScale(0.8, 0.8);
    player.setFriction(0);

    //player.setVelocityX((gameSpeed-1) * 60);
    //player.setVelocityY(gameSpeed * -60);

    //player.setVelocityX(1);


    debugText = this.add.text(10, 10, '', { font: '16px Courier', fill: 'black' });
    graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xaa6622 } });

    spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.on('pointerdown', changeAngle, this);

    timerEvent = this.time.addEvent({delay: 2400, callback: createHexes, loop: true}); 
    
    //createHexes();
}

function update(){

  hexesArr.forEach(function(h){
    if(h !== undefined){
    h.y += gameSpeed;
    }
  })

 /* if (player.y <= game.canvas.height - game.canvas.height/3){
    player.setVelocityY(0);
  }*/

  player.x += playerSpeed;

/*  if (Phaser.Input.Keyboard.JustDown(spacebar))
    {
        
        if (!this.physics.world.isPaused)
        {
          this.physics.world.pause();
        }
    }*/

  hexesArr.forEach(checkBounds);
  //this.physics.world.overlap(player, hexes, removePlayer);
  addScore();
  changeLevels();

  }

  function checkBounds(h){
    if (h.y > game.canvas.height){
      h.destroy();
      //hexesArr.shift();
      hexesArr.splice(hexesArr.indexOf(h), 1);
      //console.log(hexesArr.length);
    }
  }

  function removePlayer(p, h){
    
    var points = [
      new Phaser.Geom.Point(h.x + (h.displayWidth/3), h.y),
      new Phaser.Geom.Point(h.x + h.displayWidth - (h.displayWidth/3), h.y),
      new Phaser.Geom.Point(h.x + h.displayWidth, h.y + (h.displayHeight/2)),
      new Phaser.Geom.Point(h.x + h.displayWidth - (h.displayWidth/3), h.y + h.displayHeight),
      new Phaser.Geom.Point(h.x + (h.displayWidth/3), h.y + h.displayHeight),
      new Phaser.Geom.Point(h.x, h.y + (h.displayHeight/2))
    ];

   /* var pointsPlayer = [
      new Phaser.Geom.Point(player.x, p.y-(p.height/2)),
      new Phaser.Geom.Point(p.x + (p.width/2), p.y + (p.height/2)),
      new Phaser.Geom.Point(p.x - (p.width/2), p.y + (p.height/2))
    ];*/

    var pointsPlayer = [
      player.x, p.y-(p.height/2),
      p.x + (p.width/2), p.y + (p.height/2),
      p.x - (p.width/2), p.y + (p.height/2)
    ];

    var polygon = new Phaser.Geom.Polygon(points);
    //var polyPlayer = new Phaser.Geom.Triangle(pointsPlayer, null, p.scaleX, p.scaleY);
    var polyPlayer = new Phaser.Geom.Triangle(
    player.x, p.y-(p.displayHeight/2),
    p.x + (p.displayWidth/2), p.y + (p.displayHeight/2),
    p.x - (p.displayWidth/2), p.y + (p.displayHeight/2));

    Phaser.Geom.Triangle.Rotate(polyPlayer, p.angle * (Math.PI/180));

    graphics.clear();
    graphics.strokePoints(polygon.points, true);
    graphics.strokeTriangleShape(polyPlayer);

    

  }

  function changeAngle(){
    player.angle *= -1;
    //player.setVelocityX(player.body.velocity.x *= -1);
    playerSpeed *= -1;
  }

  function createHexes(){

  hexPositions = [
    {x: 0, y: -208},
    {x: game.canvas.width/2 - 120, y: -208},
    {x: game.canvas.width - game.canvas.width/3, y: -208}
  ];
  var pos = Phaser.Utils.Array.GetRandom(hexPositions);
  //var h = hexes.create(pos.x, pos.y, 'hex');
  var h = self.matter.add.image(pos.x, pos.y, 'hex');
  h.setBody({
    type: 'polygon',
    sides: 6,
    radius: h.height/2
  });
  //var h = new Phaser.Physics.Matter.Image(worldRef, pos.x, pos.y, 'hex');
  hexes.add(h);
  h.displayWidth = game.canvas.width/3;
  h.displayHeight = 208;

 // h.setOrigin(0);

  hexesArr.push(h);

  timerEvent.reset(
    {delay: Math.floor(((h.displayHeight * 1.3)/(gameSpeed * 60)) * 1000), callback: createHexes, loop: true} 
  );

  }

  function createHexes2(){

    hexPositions = [
      {x: 0, y: -208},
      {x: game.canvas.width/2 - 120, y: -312},
      {x: game.canvas.width - game.canvas.width/3, y: -208}
    ];

  for (var i = 0; i < 2; i++){

    var pos = Phaser.Utils.Array.GetRandom(hexPositions);
    //var pos = hexPositions[i];
    var h = hexes.create(pos.x, pos.y, 'hex');
    hexPositions.splice(hexPositions.indexOf(pos), 1);
    h.displayWidth = Math.floor(game.canvas.width/3);
    h.displayHeight = 208;
  
    h.setOrigin(0);
  
    hexesArr.push(h);

  }
    
    timerEvent.reset(
      {delay: Math.floor(((h.displayHeight * 1.3)/(gameSpeed * 60)) * 1000), callback: createHexes2, loop: true} 
    );
  
    }

    function addScore(){
      /*if (Phaser.Time.Clock.now >= Phaser.Time.Clock.now - 10){
        score++;
        debugText.setText(score);
      }*/
      score++;
      debugText.setText(score);
    }

    function changeLevels(){
      if (score == 1500){
        timerEvent.callback = createHexes2;
      }
    }