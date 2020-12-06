var sabrina_animation,sabrina;
var PLAY=1;
var END=0;
var gameState=PLAY;
var invisibleGround;
var score=0;
localStorage["HighestScore"] = 0;
var obstacle,obstacleImg;

function preload(){
    sabrina_animation=loadAnimation('sprites/1.png','sprites/2.png','sprites/3.png','sprites/4.png','sprites/5.png','sprites/6.png');
    sabrina_collided=loadAnimation('sprites/2.png');
    bgImg=loadImage('sprites/bg.png');
    obstacleImg=loadImage('sprites/obss.png');
    gameOverImg=loadImage('sprites/gameover.png');
    restartImg=loadImage('sprites/reset.png');
}

function setup(){
    createCanvas(1100,400)
    bg=createSprite(600,150,10,10);
    bg.addImage('bg',bgImg);
    bg.scale=0.6;
    gameOver=createSprite(550,150,10,10);
    gameOver.addImage('go',gameOverImg);
    gameOver.scale=0.4;
    gameOver.visible=false;
    sabrina=createSprite(100,230,10,10);
    sabrina.addAnimation('sa',sabrina_animation);
    sabrina.addAnimation("collided", sabrina_collided);
    sabrina.scale=0.3;
    ground=createSprite(10,300,1500,20);
    ground.visible=false;
    bg.x = bg.width/4;
    restart=createSprite(550,260,10,10);
    restart.addImage('ri',restartImg);
    restart.visible=false;
    restart.scale=0.3;
    
    obstaclesGroup= new Group();

}

function draw(){
    background('white');
    if (gameState===PLAY){
        bg.velocityX = -(6 + 3*score/100);
        score = score + Math.round(getFrameRate()/60);
        if((touches.length > 0 || keyDown("SPACE")) && sabrina.y  >= height-170) {
            sabrina.velocityY = -12;
            touches = []
        }
        sabrina.velocityY = sabrina.velocityY + 0.8
    
        if (bg.x < 100){
            bg.x = bg.width/4;
        }
        sabrina.setCollider('circle',0,0,190)
        // sabrina.debug = true;
        sabrina.collide(ground);
        obstaclesGroup.collide(ground);
        spawnObstacles();
  
        if(obstaclesGroup.isTouching(sabrina)){
            gameState = END;
    }
    }else if (gameState === END) {
        gameOver.visible = true;
        restart.visible=true;
        //set velocity of each game object to 0
        bg.velocityX = 0;
        sabrina.velocityY = 0;
        obstaclesGroup.setVelocityXEach(0);
    
        //change the sabrina animation
        sabrina.changeAnimation("collided",sabrina_collided);
    
        //set lifetime of the game objects so that they are never destroyed
        obstaclesGroup.setLifetimeEach(-1);

        if(touches.length>0 || keyDown("SPACE")) {      
            reset();
            touches = []
          }
    }
    // calling obstacles function
    spawnObstacles()
    drawSprites();
    push();
    fill('white');
    text("Score: "+ score, 1000,50);
    text("HighestScore: "+ localStorage["HighestScore"],890,50);
    pop();
}
function spawnObstacles() {
    if(frameCount % 50 === 0) {
        obstacle=createSprite(1200,250,30,30);
        obstacle.addImage('oi',obstacleImg);
        obstacle.scale=0.12;
        // obstacle.debug = true;
        obstacle.setCollider('circle',0,0,160)
        obstacle.velocityX = -(10 + 3*score/100);
        obstacle.lifetime = 400;
      //add each obstacle to the group
        obstaclesGroup.add(obstacle);
    }
}
function reset(){
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    
    obstaclesGroup.destroyEach();
    sabrina.changeAnimation("sa",sabrina_animation);
    
    if(localStorage["HighestScore"]<score){
      localStorage["HighestScore"] = score;
    }
    console.log(localStorage["HighestScore"]);

    score = 0;
    
  }