var trex,trex_running;
var ground, groundImg;
var score;
var PLAY = 1;
var END = 0;
var gameState = PLAY;

function preload() {
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImg = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  trex_collided = loadImage("trex_collided.png");
  gameoverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //Create trex sprite 
  trex = createSprite(50,height-70,20,50)
  trex.addAnimation ("running" ,trex_running);
  trex.addAnimation ("collided" ,trex_collided);
  
  //Creating edges
  edges=createEdgeSprites();
 
  //Creating ground
  ground = createSprite(width/2,height-80,width,2);
  ground.addImage("ground",groundImg)
  ground.x=width/2;
  
  //Creating Gameover
  gameOver = createSprite(width/2,height/2-50)
  gameOver.addImage(gameoverImg)
  
  //Creating restart
  restart = createSprite(width/2,height/2)
  restart.addImage(restartImg)
  
  gameOver.scale=0.5
  restart.scale=0.5
  
 
  
  //creating invisible ground
  invGround = createSprite(width/2,height,width,125);
  invGround.visible = false; 
  
  //adding scale to trex
  trex.scale=0.5;
  trex.x=50;
  
  //setting score
  score = 0

  //making groups
  obstacleGroup = new Group();
  cloudGroup = new Group();
  
  trex.setCollider("circle",0,0,40);
  //trex.debug=true
  
  score=0
  
  
}


function draw() {
  //setting background colour
  background(256);
        
  //adding score
  text("Score: " + score, width-100,50);
   
  
  if(gameState == PLAY){
    
    gameOver.visible=false
    restart.visible=false
    
    
    //moving the ground
    ground.velocityX = -(6 + 3*score/100);
    //scoring
    score = score + Math.round((getFrameRate()/60))
        
  //resetting the ground
    if (ground.x<0){
    ground.x=ground.width/2;
  }
    //making trex jump on space
  if(touches.length > 0 || keyDown("space") && trex.y>=height-120){
    trex.velocityY=-10; 
    jumpSound.play( );
    touches = [];
}
    //adding gravity to trex
  trex.velocityY=trex.velocityY+1 ;
  
  //spawn the clouds
  spawnClouds();
  
  //spawn the obstacles
  spawnObstacles();
  
  if(obstacleGroup.isTouching(trex)){
    gameState = END;
    dieSound.play();
  }
  
  }
  else if(gameState == END){
    
    
    gameOver.visible=true
    restart.visible=true
    
         
    //stopping the ground and trex
    ground.velocityX=0; 
    trex.velocityY=0;
  
    //stopping velocity
    cloudGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    
    //changing animation of trex
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game object so that they are never destroyed
    cloudGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);
  }
    
  
  //stop trex from falling
  trex.collide(invGround);
  
  if(touches.length > 0 || mousePressedOver(restart)){
    reset();
    touches=[];
  }
  
  
  drawSprites()
  
}
function spawnClouds() {
if(frameCount % 120 === 0){
  cloud = createSprite(width+20,height-300,40,10);
  cloud.y = Math.round(random(40,100));
cloud.velocityX= -3;
  cloud.addImage(cloudImg);
  cloud.scale=0.7;
  
  //adjust trex depth
  cloud.depth=trex.depth;
  trex.depth=trex.depth+1;
  
  //assigning lifetime to cloud
  cloud.lifetime = 195;
  
  //adding each cloud to group
  cloudGroup.add(cloud);
}
}
function spawnObstacles() {
  if ( frameCount % 60 === 0){
  obstacle = createSprite(600,height-95,10,40);
  obstacle.velocityX = -(6 + 3*score/100);
  
  //generate random obstacle
  var rand = Math.round(random(1,6));
  switch(rand){
      case 1: obstacle.addImage(obstacle1);
      break;
      case 2: obstacle.addImage(obstacle2);
      break;
      case 3: obstacle.addImage(obstacle3);
      break;
      case 4: obstacle.addImage(obstacle4);
      break;
      case 5: obstacle.addImage(obstacle5);
      break;
      case 6: obstacle.addImage(obstacle6);
      break;
      default:break;
  }
    
    obstacle.scale = 0.4;
    obstacle.lifetime = 100;

  //adding each obstacle to group
  obstacleGroup.add(obstacle);
  }
}
  function reset(){
   gameState = PLAY; 
   obstacleGroup.destroyEach();
   cloudGroup.destroyEach();
   trex.changeAnimation("running",trex_running)
   score = 0
  }