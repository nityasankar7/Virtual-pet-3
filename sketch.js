var dog,dogImg,dogImg1,sadDog;
var database;
var foodS,foodStock;
var feed,addFood;
var foodObj;
var fedTime1,lastFed1;
var fedTime;
var changeState,readState;
var bedroom, garden,washroom;
var gameState;
var currentTime;




function preload(){
   dogImg=loadImage("Dog.png");
   dogImg1=loadImage("happy dog.png");
   bedroom=loadImage("Bed Room.png")
   washroom=loadImage("Wash Room.png")
   garden=loadImage("Garden.png")
   sadDog=loadImage("Lazy.png")
  }

//Function to set initial environment
function setup() {
  database=firebase.database(); 
  createCanvas(400,500);
   fedTime1 = new Food1(); 
   foodStock=database.ref('Food'); 
   foodStock.on("value",readStock); 
   fedTime=database.ref('FeedTime'); 
   fedTime.on("value",function(data){ 
    lastFed=data.val(); });


    readState= database.ref('gameState')
    readState.on("value",function(data){
       gameState=data.val()
    });
    
  dog=createSprite(250,300,150,150);
  dog.addImage(dogImg);
  dog.scale=0.15;

 
  
  textSize(20); 

 

  fedTime= new Food1(100,100)
  feed= createButton("Feed the Dog")
  feed.position(500,95)
  feed.mousePressed(feedDog)
 
  addFood= createButton("Add Food")
  addFood.position(600,95)
  addFood.mousePressed(addFoods)

 

}

// function to display UI
function draw() {
  background(46,139,87);
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog)
  }
  currentTime=hour();
  if(currentTime==(fedTime1+1)){
    update("Playing")
    foodObj.garden();
  } else if(currentTime==(fedTime1+2)){
    update("Sleeping")
    foodObj.bedroom();
  } else if(currentTime>(fedTime1+2) && currentTime<=(fedTime1+4) ){
    update("Bathing")
    foodObj.washroom();
  } else{
    update("Hungry")
    fedTime.display();
    dog.addImage(dogImg);
  }
 

  drawSprites();
  fill(255,255,254);
  stroke("black");
  text("Food remaining : "+foodS,170,200);
  textSize(13);
  text("Note: Use the buttons to feed",130,10,300,20);
  
}

//Function to read values from DB
function readStock(data){
  foodS=data.val();
}

//Function to write values in DB
function writeStock(x){
  if(x<=0){
    x=0;
  }else{
    x=x-1;
  } 
  database.ref('/').update({
    Food:x
  })
  
}
function feedDog(){
 dog.addImage(dogImg1)  
 fedTime1.updateFoodStock(fedTime1.getFoodStock()-1);
 database.ref('/').update({
  Food: fedTime1.getFoodStock(),
  fedTime1:hour()
})

}
function addFoods(){
 foodS++;
 database.ref('/').update({
  Food: foodS
 
})

}
function update(state){
 database.ref('/').update({
 gameState:state
 });

 }

