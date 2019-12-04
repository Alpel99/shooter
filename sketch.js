let width = window.innerWidth - 20;
let height = window.innerHeight - 20;
let x = width/2;
let y = height/2;
let seite = ["links", "rechts", "oben", "unten"];
let upgrades = ["sides", "damage", "bullets", "speed", "big", "bulletspeed"]
//let nosides = ["damage", "bullets", "speed", "big", "bulletspeed"]
let enemies = [];
let bullets = [];
let bigorig = 50; // player size (hp = size)
let minhp = 30; //minimum leben
let playerdamage = 10; //damage bei hit
let movespeedorig = 10; //player speed
let minfat = (width+height)/30; //minimum size enemy (should be klickable)
let fatness = (width+height)/15; //size/hp enemy (maximum)
let speedorig = 500; //speed enemy (is always recursive to this.fat)
let bulletspeedorig = 30; //speed from bullet
let bulletmaxorig = 1; //number of maximum bullets at the same time
let damageorig = 10; //damage from bullet
let minrange = (width+height)/20; //minimum aggro range
let score = 0; //score
let level = 0; //level
let run = false; //game running
let dead = false; //player dead
let sides = false; //ability to go through sides
let upgradeset = false; //are the random upgrades set
let levelborderorig = 5; //how many score you need for 1 levelup [try 20 for real game]
let u1 = "damage"; //defining two global variables
let u2 = "bullets";
let interest = 240; //how fast enemies lose interest (high number = slow)
let t = 35;
let upgradeable = false;
let big = bigorig;
let speed = speedorig;
let movespeed = movespeedorig;
let bulletmax = bulletmaxorig;
let damage = damageorig;
let bulletspeed = bulletspeedorig;
let levelborder = levelborderorig;


function setup() {
    createCanvas(width, height);
    frameRate(60);
    strokeWeight(1);
    stroke(color(0,0,0));
    x = width/2;
    y = height/2;
    big = bigorig;
        speed = speedorig;
        movespeed = movespeedorig;
        bullets = [];
        bulletmax = bulletmaxorig;
        bulletspeed = bulletspeedorig;
        damage = damageorig;
	levelborder = levelborderorig;
    score = 0;
    level = 0;
    dead = false;
    upgradeset = false;
    sides = false;
        constructorsetup();
}

function constructorsetup() {
    for(let i = 0; i < 5; i++) {
        enemies[i] = new Enemy();
    }
    for(let i = 0; i < bulletmax; i++) {
        bullets[i] = new Bullet();
    }
}

function draw() {
    if (run == true) {
        background(color(0,16,100));
        fill(230,40,0);
        ellipse(x,y,big,big);
        
        for(let i = 0; i < enemies.length; i++) {
            var g = 0;
                enemies[i].move();
                enemies[i].show();
        }
        
        for(let i = 0; i < bullets.length; i++) {
            var g = 0;
            if (bullets[i].see == true) {
                bullets[i].move();
                bullets[i].show();
            }
        }
        textSize(32);
        fill(255,255,255);
        textAlign(LEFT);
        text("Score: " + score, 20, 40);
        text("Level: " + level, 20, 80);
        
        if(keyIsDown(RIGHT_ARROW)||keyIsDown(68)) {
            if (x < width - big/2) {
                x = x + movespeed;
            } else if (sides == true) {
				x = x + movespeed;
				if (x > width) {
					x = 0;
				}
			}
        }
        if(keyIsDown(LEFT_ARROW)||keyIsDown(65)) {
            if (x > big/2) {
                x = x - movespeed;
            } else if (sides == true) {
				x = x - movespeed;
				if ( x < 0) {
					x = width;
				}
			}
        }
        if(keyIsDown(UP_ARROW)||keyIsDown(87)) {
            if (y > big/2) {
                y = y - movespeed;
            } else if ( sides == true) {
				y = y - movespeed;
				if (y < 0) {
					y = height;
				}
			}
        }
        if(keyIsDown(DOWN_ARROW)||keyIsDown(83)) {
            if (y < height - big/2){
                y = y + movespeed;
            } else if (sides == true) {
				y = y + movespeed;
				if (y > height) {
					y = 0;
				}
			}
        }
        // guckt ob es einen Focus gibt, wenn ja: Shot()
        if(keyIsDown(32)) {
            Shot();
        }
    } else {
        background(color(0,0,0));
        textSize(32);
        fill(255,255,255);
        textAlign(LEFT);
        text("Score: " + score, 20, 40);
        text("Level: " + level, 20, 80);
        if (level == 0 && dead == false) {
            textSize(65);
            fill(255,0,0);
            textAlign(CENTER);
            text("welcome to shooter", width/2, height/2 - 100);
            textSize(25);
            fill(255,255,255);
            text("start with q or enter \n click the green targets \n move with WASD and shoot with space", width/2, height/2);
        }
        if (dead == true) {
            textSize(65);
            fill(255,0,0);
            textAlign(CENTER);
            text("Thank you for playing!", width/2, height/2 - 75);
			if (t > 50) {
				t = 35;
			}
			textSize(t);
			text("Score: " + score, width/2, height/2);
			text("Level: " + level, width/2, height/2 + 50);
			t = t + 0.2;
            textSize(25);
            fill(255,255,255);
            text("restart with q or enter", width/2, height/2 + 100);
        }
        if (level > 0 && dead == false) {
            levelup();
        }
    }
}

function mousePressed() {
	if (run == true) {
		for(let i = enemies.length - 1; i > -1; i--) {
			for (let g = 0; g < enemies.length; g++) {
				enemies[g].focus = false;
			}
			if (dist(mouseX, mouseY, enemies[i].x, enemies[i].y) < enemies[i].fat/2) {
				enemies[i].focus = true;
				i = -1;
			}
		}
	}
	if (run == false && upgradeable == true) {
		if(width/2+300 > mouseX && width/2+100 < mouseX && height/2 - 100 < mouseY && height/2 + 100 > mouseY) {
			//u2
			switch(u2) {
				case "damage":
					damage = damage + 5;
					break;
				case "sides":
					sides = true;
					break;
				case "big":
					big = big + 20;
					break;
				case "bullets":
					bulletmax = bulletmax + 1;
					break;
				case "speed":
					movespeed = movespeed + 5;
					break;
				case "bulletspeed":
					bulletspeed = bulletspeed + 10;
					break;
			}
			upgradeset = false;
			run = true;
			constructorsetup();
			x = width/2;
			y = height/2;
			speed = speed + 100;
			upgradeable = false;
			levelborder = levelborderorig + level;
		}
		if(width/2-100 > mouseX && width/2-300 < mouseX && height/2 - 100 < mouseY && height/2 + 100 > mouseY) {
			//u1
			switch(u1) {
				case "damage":
					damage = damage + 5;
					break;
				case "sides":
					sides = true;
					break;
				case "big":
					big = big + 20;
					break;
				case "bullets":
					bulletmax = bulletmax + 1;
					break;
				case "speed":
					movespeed = movespeed + 5;
					break;
				case "bulletspeed":
					bulletspeed = bulletspeed + 10;
					break;
			}
			upgradeset = false;
			run = true;
			constructorsetup();
			x = width/2;
			y = height/2;
			speed = speed + 100;
			upgradeable = false;
			levelborder = levelborderorig + level;
		}
		
	}
}

function keyPressed() {
	if(keyCode == 13||keyCode == 81) { //enter || q
        run = true;
        setup();
    }
	
}

function levelup() {
    //set Upgrade
    if (upgradeset == false) {
        u1 = random(upgrades);
        u2 = random(upgrades);
        while (u1 == u2 || (sides == true && u1 == "sides") || (sides == true && u2 == "sides")) {
            u1 = random(upgrades);
            u2 = random(upgrades);
        }
        /*if (sides == true && u1 == "sides") {
            u1 = random(nosides);
        }
        if (sides == true && u2 == "sides") {
            u2 = random(nosides);
        }*/
        upgradeset = true;
    }
    //two strokes of rectangles
    strokeWeight(4);
    stroke(color(255,255,255));
    fill(0,0,0);
    rect(width/2 - 300, height/2 - 100, 200, 200);
    rect(width/2 + 100, height/2 - 100, 200, 200);
    //set everything back to normal
    strokeWeight(1);
    stroke(color(0,0,0));
    textSize(20);
    textAlign(CENTER);
    //display upgrades
    //u1 = "sides";
    switch(u2) {
        case "damage":
            fill(255,0,0);
            ellipse(width/2 + 200, height/2 - 20, 30, 30);
            fill(255,255,255);
            ellipse(width/2 + 200, height/2 - 20, 15, 15);
            fill(255,255,255);
            text("increase damage", width/2 + 200, height/2 + 50);
            break;
        case "sides":
            fill(255,0,0);
            if(width/2+300 > mouseX && width/2+100 < mouseX && height/2 - 100 < mouseY && height/2 + 100 > mouseY) {
                ellipse(width/2 + 230, height/2 - 25, bigorig, bigorig);    
            } else {
                ellipse(width/2 + 185, height/2 - 25, bigorig, bigorig);
            }
            strokeWeight(3);
            stroke(color(200,200,200));
            line(width/2 + 200, height/2 - 75, width/2 + 200, height/2 + 25)
            strokeWeight(1);
            stroke(color(0,0,0));
            fill(255,255,255);
            text("ability to go \n through sides", width/2 + 200, height/2 + 50);
            break;
        case "bullets":
            fill(255,255,255);
            var i = 0;
            while (i < 3) {
                ellipse(random(width/2 + 120, width/2 + 280), random(height/2 - 80, height/2 + 20), 5, 5);
                i++;
            }
            text("increase firerate", width/2 + 200, height/2 + 50);
            break;
        case "speed":
            fill(255,0,0);
            ellipse(width/2 + 200 + bigorig, height/2 - 20, bigorig, bigorig);
            strokeWeight(3);
            stroke(color(200,200,200));
            line(width/2 + 120, height/2 - 20, width/2 + 165 + bigorig, height/2 - 20);
            line(width/2 + 140, height/2, width/2 + 170 + bigorig, height/2 - 10);
            line(width/2 + 130, height/2 - 40, width/2 + 170 + bigorig, height/2 - 30);
            line(width/2 + 120, height/2 + 20, width/2 + 175 + bigorig, height/2);
            line(width/2 + 135, height/2 - 60, width/2 + 175 + bigorig, height/2 - 40);
            strokeWeight(1);
            stroke(color(0,0,0));
            fill(255,255,255);
            text("increase speed", width/2 + 200, height/2 + 50);
            break;
        case "big":
            fill(255,0,0);
            ellipse(width/2 + 200, height/2 - 25, bigorig, bigorig);
            if(width/2+300 > mouseX && width/2+100 < mouseX && height/2 - 100 < mouseY && height/2 + 100 > mouseY) {
                ellipse(width/2 + 200, height/2 - 25, bigorig + 20, bigorig + 20);    
            }
            fill(255,255,255);
            text("increase size \n and hp", width/2 + 200, height/2 + 50);
            break;
		case "bulletspeed":
			fill(255,255,255);
            ellipse(width/2 + 255 , height/2 - 20, 10, 10);
            strokeWeight(1.5);
            stroke(color(200,200,200));
            line(width/2 + 150, height/2 - 20, width/2 + 240, height/2 - 20);
            line(width/2 + 170, height/2, width/2 + 245, height/2 - 18);
            line(width/2 + 160, height/2 - 40, width/2 + 245, height/2 - 22);
            line(width/2 + 145, height/2 + 20, width/2 + 247, height/2 - 16 );
            line(width/2 + 165, height/2 - 60, width/2 + 247, height/2 - 24);
            strokeWeight(1);
            stroke(color(0,0,0));
            fill(255,255,255);
            text("increase bullet speed", width/2 + 200, height/2 + 50);
            break;
    }
    switch(u1) {
        case "damage":
            fill(255,0,0);
            ellipse(width/2 - 200, height/2 - 20, 30, 30);
            fill(255,255,255);
            ellipse(width/2 - 200, height/2 - 20, 15, 15);
            fill(255,255,255);
            text("increase damage", width/2 - 200, height/2 + 50);
            break;
        case "sides":
            fill(255,0,0);
            if(width/2-100 > mouseX && width/2-300 < mouseX && height/2 - 100 < mouseY && height/2 + 100 > mouseY) {
                ellipse(width/2 - 170, height/2 - 25, bigorig, bigorig);    
            } else {
                ellipse(width/2 - 215, height/2 - 25, bigorig, bigorig);
            }
            strokeWeight(3);
            stroke(color(200,200,200));
            line(width/2 - 200, height/2 - 75, width/2 - 200, height/2 + 25)
            strokeWeight(1);
            stroke(color(0,0,0));
            fill(255,255,255);
            text("ability to go \n through sides", width/2 - 200, height/2 + 50);
            break;
        case "bullets":
            fill(255,255,255);
            var i = 0;
            while (i < 3) {
                ellipse(random(width/2 - 280, width/2 - 120), random(height/2 - 80, height/2 + 20), 5, 5);
                i++;
            }
            text("increase firerate", width/2 - 200, height/2 + 50);
            break;
        case "speed":
            fill(255,0,0);
            ellipse(width/2 - 200 + bigorig, height/2 - 20, bigorig, bigorig);
            strokeWeight(3);
            stroke(color(200,200,200));
            line(width/2 - 280, height/2 - 20, width/2 - 235 + bigorig, height/2 - 20);
            line(width/2 - 260, height/2, width/2 - 230 + bigorig, height/2 - 10);
            line(width/2 - 270, height/2 - 40, width/2 - 230 + bigorig, height/2 - 30);
            line(width/2 - 280, height/2 + 20, width/2 - 225 + bigorig, height/2);
            line(width/2 - 265, height/2 - 60, width/2 - 225 + bigorig, height/2 - 40);
            strokeWeight(1);
            stroke(color(0,0,0));
            fill(255,255,255);
            text("increase speed", width/2 - 200, height/2 + 50);
            break;
        case "big":
            fill(255,0,0);
            ellipse(width/2 - 200, height/2 - 25, bigorig, bigorig);
            if(width/2-100 > mouseX && width/2-300 < mouseX && height/2 - 100 < mouseY && height/2 + 100 > mouseY) {
                ellipse(width/2 - 200, height/2 - 25, bigorig + 20, bigorig + 20);    
            }
            fill(255,255,255);
            text("increase size \n and hp", width/2 - 200, height/2 + 50);
            break;
		case "bulletspeed":
			fill(255,255,255);
            ellipse(width/2 - 145, height/2 - 20, 10, 10);
            strokeWeight(1.5);
            stroke(color(200,200,200));
            line(width/2 - 250, height/2 - 20, width/2 - 160, height/2 - 20);
            line(width/2 - 230, height/2, width/2 - 155, height/2 - 18);
            line(width/2 - 240, height/2 - 40, width/2 - 155, height/2 - 22);
            line(width/2 - 255, height/2 + 20, width/2 - 153, height/2 - 16 );
            line(width/2 - 235, height/2 - 60, width/2 - 153, height/2 - 24);
            strokeWeight(1);
            stroke(color(0,0,0));
            fill(255,255,255);
            text("increase bullet speed", width/2 - 200, height/2 + 50);
            break;
    }
}

//guckt ob es eine "unbenutze" Bullet gibt, macht die erste unbenutze neu
function Shot() {
    for (let i = 0; i < bullets.length; i++) {
        if (bullets[i].see == false) {
            bullets[i] = new Bullet();
            bullets[i].see = true;
            i = bullets.length + 1;
        }
    }
}

class Enemy {
constructor(){
    this.s = random(seite);
    if (this.s == "links") {
        this.x = 0;
        this.y = random(height);
    }
    if (this.s == "rechts") {
        this.x = width;
        this.y = random(height);
    }
    if (this.s == "oben") {
        this.x = random(width);
        this.y = 0;
    }
    if (this.s == "unten") {
        this.x = random(width);
        this.y = height;
    }
    this.fat = random(minfat,fatness);
    this.fatspeed = (1/this.fat)*speed;
    this.focus = false;
    this.lock = false;
    this.cr = random(20,80);
    this.cg = random(150,200);
    this.cb = random(10,50);
    this.ny = random(height);
    this.nx = random(width);    
}
show() {
    if (this.focus == false) {
        fill(this.cr,this.cg,this.cb);
    } else {
        fill(245,66,218);
    }
    ellipse(this.x,this.y,this.fat,this.fat);
}
move() {
    //move#2
    if (dist(this.x,this.y,x,y) < minrange + this.fat || dist(this.x,this.y,x,y) < this.fat * 2) {
        this.lock = true;
    }
    if (this.lock == true) {
		if (Math.floor(random(0,interest))==42) {
			this.lock = false;
		}
        var a = Math.abs(this.x - x) + Math.abs(this.y - y);
        var b = this.x - x;
        var c = this.y - y;
        this.x = this.x - b/a*this.fatspeed;
        this.y = this.y - c/a*this.fatspeed;
    } else {
        if (dist(this.x,this.y,this.nx,this.ny) < this.fat/2) {
            this.ny = random(height);
            this.nx = random(width);
        } else {
            var a = Math.abs(this.x - this.nx) + Math.abs(this.y - this.ny);
            var b = this.x - this.nx;
            var c = this.y - this.ny;
            this.x = this.x - b/a*this.fatspeed;
            this.y = this.y - c/a*this.fatspeed;
        }
    }
    //Collision
    if (dist(x,y,this.x,this.y) < (this.fat+big)/2) {
        // Playerdamage
        if (big - playerdamage >= minhp) {
            big = big - playerdamage;
        } else {
            run = false;
            dead = true;
        }
        // new Enemy
        this.s = random(seite);
    if (this.s == "links") {
        this.x = 0;
        this.y = random(height);
    }
    else if (this.s == "rechts") {
        this.x = width;
        this.y = random(height);
    }
    else if (this.s == "oben") {
        this.x = random(width);
        this.y = 0;
    }
    else if (this.s == "unten") {
        this.x = random(width);
        this.y = height;
    }
    this.fat = random(minfat,fatness);
    this.fatspeed = (1/this.fat)*speed;
    this.focus = false;
    this.lock = false;
    this.cr = random(20,80);
    this.cg = random(150,200);
    this.cb = random(10,50);
    this.ny = random(height);
    this.nx = random(width);  
    }
}
}

class Bullet {
constructor(){
    this.see = false;
    this.x = x;
    this.y = y;
    this.ny = mouseY;
    this.nx = mouseX;
    this.a = Math.abs(this.x - this.nx) + Math.abs(this.y - this.ny);
    this.b = this.x - this.nx;
    this.c = this.y - this.ny;
    this.s = bulletspeed;
}
show() {
    if (this.see == true) {
        fill(255,255,255);
        ellipse(this.x,this.y,damage/2,damage/2)
    }
}
move() {
    this.x = this.x - this.b/this.a*bulletspeed;
    this.y = this.y - this.c/this.a*bulletspeed;
    for(let i = 0; i < enemies.length; i++) {
        if (dist(this.x, this.y, enemies[i].x, enemies[i].y) < enemies[i].fat/2 + damage/2 ) {
            if (this.see == true) {
                if (enemies[i].fat > minfat + damage){
                    enemies[i].fat = enemies[i].fat - damage;
                    this.see = false;
                } else {
                    score ++;
                    if (score - level * levelborder >= levelborder) { //score  = 10 -> levelup, score = 20 -> levelup
                        level++;
                        run = false;
                        upgradeable = true;
                    }
                    delete enemies[i];
                    enemies[i] = new Enemy();
                    this.see = false;
                }
            }
        }
    }
    if (this.x > width || this.x < 0 || this.y > height || this.y < 0) {
        this.see = false;
        this.x = x;
        this.y = y;
        this.ny = mouseY;
        this.nx = mouseX;
        this.a = Math.abs(this.x - this.nx) + Math.abs(this.y - this.ny);
        this.b = this.x - this.nx;
        this.c = this.y - this.ny;
        this.s = bulletspeed;
    }
}
}
