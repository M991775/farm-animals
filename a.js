var GameState = {
  preload: function() { 
    this.load.image('bg', 'images/background.png');
    this.load.image('ck', 'images/chicken.png');
    this.load.image('hr', 'images/horse.png');
    this.load.image('p', 'images/pig.png');
    this.load.image('sp', 'images/sheep.png');
    this.load.image('ar', 'images/arrow.png');

    this.load.spritesheet('ck', 'images/chicken_spritesheet.png',131, 200, 3);
    this.load.spritesheet('hr', 'images/horse_spritesheet.png',212, 200, 3);
    this.load.spritesheet('p', 'images/pig_spritesheet.png',297, 200, 3);
    this.load.spritesheet('sp', 'images/sheep_spritesheet.png',244, 200, 3);

    this.load.audio('cks', ['audio/chicken.mp3', 'audio/chicken.ogg']);
    this.load.audio('hrs', ['audio/horse.mp3', 'audio/horse.ogg']);
    this.load.audio('ps', ['audio/pig.mp3', 'audio/pig.ogg']);
    this.load.audio('sps', ['audio/sheep.mp3', 'audio/sheep.ogg']);

  },
  create: function() {
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.scale.setScreenSize(true);

    this.bg = this.game.add.sprite(0, 0, 'bg');

    var animalData =[
        {key:'ck', text:'chicken', audio:'cks'},
        {key:'hr', text:'horse', audio:'hrs'},
        {key:'p', text:'pig' , audio:"ps"},
        {key:'sp', text:'sheep', audio:'sps'}
    ];
    
    this.animals = this.game.add.group();
    var self = this;
    var animal;
    
    animalData.forEach(function(element){
      animal = self.animals.create(-1000, self.game.world.centerY, element.key,2);
      animal.customParams = {text: element.text,  sound: self.game.add.audio(element.audio)};
      animal.anchor.setTo(0.5);

      animal.animations.add('animate', [0, 1, 2, 1, 0, 1], 3, false);

      animal.inputEnabled = true;
      animal.input.pixelPerfectClick = true;
      animal.events.onInputDown.add(self.animateAnimal, self);

      
    });

    this.currentAnimal = this.animals.next();
    this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY,);
    
    this.showText(this.currentAnimal);
   
    this.rightArrow = this.game.add.sprite(580, this.game.world.centerY, "ar");
    this.rightArrow.anchor.setTo(0.5);
    this.rightArrow.customParams = {direction: 1};

    this.rightArrow.inputEnabled = true;
    this.rightArrow.input.pixelPerfectClick = true;
    this.rightArrow.events.onInputDown.add(this.switchAnimal, this);


    this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, "ar");
    this.leftArrow.anchor.setTo(0.5);
    this.leftArrow.scale.x = -1;
    this.leftArrow.customParams = {direction: -1};

    this.leftArrow.inputEnabled = true;
    this.leftArrow.input.pixelPerfectClick = true;
    this.leftArrow.events.onInputDown.add(this.switchAnimal, this);
  },
  update: function() {
  },
  switchAnimal: function(sprite,  event){
       if(this.isMoving) {
           return false;
       }

       this.isMoving = true;

       this.animalText.visible = false;

       var newAnimal, emdX;

       if(sprite.customParams.direction > 0) {
           newAnimal = this.animals.next();
            newAnimal.x = -newAnimal.width/2;
           endX = 640 + this.currentAnimal.width/2;
       }
       else{
           newAnimal = this.animals.previous();
           newAnimal.x = 640 + newAnimal.width/2;
           endX = -this.currentAnimal.width/2
       }
       var newAnimalMovement = game.add.tween(newAnimal);
       newAnimalMovement.to({x: this.game.world.centerX}, 1000);
       newAnimalMovement.onComplete.add(function(){
            this.isMoving = false;
            this.showText(newAnimal);
       }, this);
       newAnimalMovement.start();

       var newAnimalMovement = game.add.tween(this.currentAnimal);
       newAnimalMovement.to({x: endX}, 1000);
       newAnimalMovement.start();

       this.currentAnimal = newAnimal;

    
  },
  animateAnimal: function(sprite,  event){
    sprite.play('animate');
    sprite.customParams.sound.play();
},

showText: function(animal){
  if(!this.animlText){
      var style = {
          font: 'bold 30pt Arial',
          fill: 'red',
          align: 'center'
      }
      this.animalText = this.game.add.text(this.game.width/2,this.game.height * 0.85, '', style);
      this.animalText.anchor.setTo(0.5);
  }
  this.animalText.setText(animal.customParams.text);
  this.animalText.visible = true;
}

};
var game = new Phaser.Game(640, 360, Phaser.AUTO);


game.state.add('GameState',GameState);
game.state.start('GameState');