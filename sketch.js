//define game states as numbers (values)
var PLAY = 1;
var END = 0;

//initial game state
var gameState = PLAY;

//define trex and ground (including invisible ground)
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

//define cloud group and obstacle group
var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

//define game over and restart
var gameOver, gameOverImage;
var restart, restartImage;

//define sounds
var checkPointSound;
var playSound;
var deathSound;

//define score variable
var score;

function preload(){
  
    //load images here
    //trex animation
    trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
    trex_collided = loadImage("trex_collided.png");

    //ground image
    groundImage = loadImage("ground2.png");

    //cloud image
    cloudImage = loadImage("cloud.png");

    //all six obstacles images
    obstacle1 = loadImage("obstacle1.png");
    obstacle2 = loadImage("obstacle2.png");
    obstacle3 = loadImage("obstacle3.png");
    obstacle4 = loadImage("obstacle4.png");
    obstacle5 = loadImage("obstacle5.png");
    obstacle6 = loadImage("obstacle6.png");
  
    //game over and restart
    gameOverImage = loadImage("gameOver.png");
    restartImage = loadImage("restart.png");
  
    //load sounds
    checkPointSound = loadSound("checkPoint.mp3");
    playSound = loadSound("jump.mp3");
    deathSound = loadSound("die.mp3");
  
}

function setup() {
    
    //create canvas dimensions
    createCanvas(600, 200);

    //define trex sprite
    trex = createSprite(50,180,20,50);
    trex.debug = false;
    trex.setCollider("rectangle",0,0,90,90);
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided" , trex_collided);
    trex.scale = 0.5;

    //define ground sprite
    ground = createSprite(200,180,400,20);
    ground.addImage("ground",groundImage);
    ground.x = ground.width/2;
    ground.velocityX = -4;

    //define invisible ground and make it invisible
    invisibleGround = createSprite(200,190,400,10);
    invisibleGround.visible = false;

    // create Obstacles and Cloud groups
    obstaclesGroup = createGroup();
    cloudsGroup = createGroup();

    //string concatenation with the console
    console.log("Hello" + 5);

    //initial score
    score = 0;
  
    //define gameover sprite
    gameOver = createSprite(300,100,10,10);
    gameOver.addImage(gameOverImage);
    gameOver.scale = 0.5;
  
    //define restart sprite
    restart = createSprite(300,130,10,10);
    restart.addImage(restartImage);
    restart.scale = 0.5;
  
}

function draw() {
  
    //set background
    background(180);

    //display score text
    text("Score: "+ score, 500,50);

    if(gameState === PLAY){

      //game over and restart sprites are invisible
      gameOver.visible = false;
      restart.visible = false;
      
      //move the ground with game adaptivity
      ground.velocityX = -(4 + score/400);

      //if space is pressed, the trex jumps and sound plays
      if(keyDown("space") && trex.y >= 160) {
        trex.velocityY = -13;
        playSound.play();
      }

      //score = score + Math.round(frameCount/60);
      //score = score + Math.round(frameRate()/60);
      
      //score increases as frameCount does
      score = Math.round(score + 0.5);

      //add gravity to trex
      trex.velocityY = trex.velocityY + 0.8;

      //spawn the clouds
      spawnClouds();

      //spawn obstacles on the ground
      spawnObstacles();

      //loop the ground
      if (ground.x < 0){
        ground.x = ground.width/2;
      }

      //play sound if the score is multiple of 200
      if(score % 200 === 0){
        checkPointSound.play();
      }
      
      //game state changes to end when trex hits any obstacle and a sound plays
      if(trex.isTouching(obstaclesGroup)){
        gameState = END;
        deathSound.play();
      }
      
      //change animation of trex
      trex.changeAnimation("running", trex_running);

    }
  
    else if(gameState === END){

      //gameOver and restart sprites become visible
      gameOver.visible = true;
      restart.visible = true;
      
      //trex pauses
      trex.velocityY = 0;
      
      //if user clicks restart button, the game resets
      if(mousePressedOver(restart)){
        reset();
      }
      
      //stop the ground
      ground.velocityX = 0;

      //stop obstacles
      obstaclesGroup.setVelocityEach(0,0);

      //stop clouds
      cloudsGroup.setVelocityEach(0,0);

      //stop the obstacles and clouds from disappearing
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);

      //stop trex animation
      trex.changeAnimation("collided" , trex_collided);

    }

    //trex should collide with the invisible ground at all times
    trex.collide(invisibleGround);

    //draw sprites function
    drawSprites();
  
}

function spawnObstacles(){
   
    if (frameCount % 60 === 0){
      
      //define obstacle sprite and set velocityX
      var obstacle = createSprite(600,165,10,40);
      obstacle.velocityX = -(6 + score/400);

      //generate random obstacles
      var rand = Math.round(random(1,6));
      switch(rand) {
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
        default: break;
      }

      //assign scale and lifetime to the obstacle           
      obstacle.scale = 0.5;
      obstacle.lifetime = 300;

      //adding obstacles to the group
      obstaclesGroup.add(obstacle);
   }
  
}

function spawnClouds() {
    
    //write code here to spawn the clouds
    if (frameCount % 60 === 0) {
      
      //define clouds sprite
      cloud = createSprite(600,100,40,10);
      cloud.y = Math.round(random(10,60));
      cloud.addImage(cloudImage);
      cloud.scale = 0.5;
      cloud.velocityX = -3;

      //assign lifetime to the variable
      cloud.lifetime = 200;

      //adjust the depth
      cloud.depth = trex.depth;
      trex.depth = trex.depth + 1;

      //adding cloud to the group
      cloudsGroup.add(cloud);
    }

}

function reset(){
  
  //game state changes to play
  gameState = PLAY;
  
  //all clouds and obstacles are destroyed
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  //score resets to zero
  score = 0;
  
}