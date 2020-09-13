var dog, dogImg, dogImg1, bedroom, garden, washroom, sadDog;
var database, readState, gameState;
var foodS, foodStock, fedTime, lastFed;

function preload(){
   dogImg=loadImage("Dog.png");
   dogImg1=loadImage("happydog.png");
   bedroom = loadImage("Bed Room.png");
   garden = loadImage("Garden.png");
   washroom = loadImage("Wash Room.png");
   sadDog = loadImage("Lazy.png");
  }

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  dog=createSprite(725,200,150,150);
  dog.addImage(dogImg);
  dog.scale=0.5;

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  textSize(20); 

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  });

  feed = createButton(" Feed the dog ");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton(" Add food ");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);

  foodObj = new Food();
}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed = data.val();
  });

  if(gameState != "Hungry"){
    feed.hide();
    addFood.hide()
    dog.remove();
  }else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  currentTime = hour();
  if(currentTime == (lastFed + 1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime == (lastFed + 2)){
    update("sleeping");
    foodObj.bedroom();
  }else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
    update("Bathing");
    foodObj.washroom();
  }else{
    update("Hungry")
    foodObj.display();
  }
  fill(255,255,254);
  textSize(15);
  if(lastFed > 12){
    text("Last Feed : " + lastFed% 12 + "PM" , 350, 30);
  }else if(lastFed == 0){
    text("Last Feed : 12 AM", 350, 30);
  }else{
    text("Last Feed : " + lastFed + "AM" , 350, 30);
  }

  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(dogImg1);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food : foodObj.getFoodStock(),
    FeedTime : hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food : foodS
  })  
}

function update(state){
  database.ref('/').update({
    gameState : state
  });
}