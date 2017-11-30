import { PongBall } from './Ball';
import { PongPaddle } from './Paddle';
import { PongBasicAIPaddle } from './BasicAIPaddle';
import { PongCanvas } from './Canvas';
import { PongEvent }  from './Event';
import { Collider } from './Collider';
import { Trigger } from './Trigger';
import { PowerUp } from './PowerUp';

import { Subject } from 'rxjs/Subject';

export class PongGame {

    // Event emitter
    public events: Subject<PongEvent> = new Subject();

    // Starting values
    private startSize: number = 7;
    private gameClock: any;
    private gameSpeed: number;
    public colorFilter: string = null;

    // Game elements
    public balls: Array<PongBall> = [];
    public paddle: PongPaddle;
    public computer: PongBasicAIPaddle;
    public colliders: { [key:string]: Collider } = {};
    public drawables: { [key:string]: any } = {};

    // Game scroe
    public score = {
        a: 0,
        b: 0
    }

    constructor(
        private screen: PongCanvas, 
        private width: number, 
        private height: number, 
        private initGS: number = width / 50, 
        private speeDelta: number = 0.9999
    ) {
        this.loadImages();
        this.balls.push(new PongBall(width, height, this.initGS, this))
        var self = this;
        this.paddle = new PongPaddle(width, height, () => {
            self.screen.drawGame(this)
        })
        this.computer = new PongBasicAIPaddle(width, height, () => {
            self.screen.drawGame(this)
        })
        this.colliders.playerPaddle = this.paddle;
        this.colliders.computerPaddle = this.computer;
        this.colliders.wallTop = new Collider(0, 1, width, 1);
        this.colliders.wallBottom = new Collider(0, height - 1, width, 1);
        /* Make them critical */
        this.colliders.wallLeft = new Trigger(1, 0, 1, height, (item) => {
            this.score.b++;
            this.events.next(new PongEvent('PLAYER_MISS', this.score))
            setTimeout(() => this.lastBallOut(item), 1000)
        });
        this.colliders.wallRight = new Trigger(width - 1, 0, 1, height, (item) => {
            this.score.a++;
            this.events.next(new PongEvent('PLAYER_HIT', this.score))
            setTimeout(() => this.lastBallOut(item), 1000)
        });
        setTimeout(() => this.screen.drawGame(this), 50);
    }

    // Last ball out action
    private lastBallOut = (ball) => {
        let index = this.balls.findIndex(el => el === ball);
        this.balls.splice(index, 1);
        if(this.balls.length == 1) this.setColorFilter(null);
        if(this.balls.length < 1) {
            this.stopMoving();
            this.balls.push(new PongBall(this.width, this.height, this.initGS, this));
            this.events.next(new PongEvent('GAME_LAST_BALL_OUT'))
        }
        this.screen.drawGame(this);
    }

    // Start the game
    public start() {
        this.startMoving();
    }

    // Toggle paused state
    public toggleMoving() {
        if(this.gameClock) this.stopMoving();
        else this.startMoving();
        return this.gameClock ? true : false;
    }

    // Stop balls moving
    public stopMoving() {
        clearInterval(this.gameClock);
        this.gameClock = null;
        this.gameSpeed = this.initGS;
        this.events.next(new PongEvent('GAME_STOP'))
    }

    // Start ball moving
    private startMoving() {
        if(this.gameClock) return;
        this.events.next(new PongEvent('GAME_START'))
        var moveCount: number = 0;
        var ball;
        var timeoutFn = () => {
            for(ball of this.balls) ball.move();
            this.computer.movePad(this);
            moveCount++;
            if(moveCount > 250) { this.doRandomStuff(); moveCount = 0; }
            this.screen.drawGame(this);
        }
        this.gameClock = setInterval(timeoutFn, 20);
    }

    // Add power up
    public addBallShowerPowerUp(
        x?: number, 
        y?: number, 
        width: number = this.width / 25, 
        height: number = this.width / 25
    ) {
        if(!x) x = Math.random() * (this.width * .8) + this.width * .1;
        if(!y) y = Math.random() * (this.height * .8) + this.height * .1;
        this.colliders.badPower = new PowerUp(x, y, width, height, (item) => {
            if(this.balls.length < 2) this.ballShower(50, item.x, item.y);
            delete this.drawables.badPower;
            delete this.colliders.badPower;
        }, 'red', this.images.bad)
        this.drawables.badPower = this.colliders.badPower;
    }

    // Do random stuff
    public doRandomStuff() {
        if(this.balls.length < 2) this.addBallShowerPowerUp();
    }
    
    // Generate a shower of balls
    public ballShower(count = 12, x?, y?) {
        this.setColorFilter('INVERTED');
        var a = count / 4;
        var b = count / 2 + a;
        for(var i = 0; i < count + 2; i++) {
            if(i == a || i == b) continue;
            let ball = new PongBall(this.width, this.height, this.initGS, this);
            let angle = 360 / (count + 2) * i;
            if(angle % 180 == 90) angle += 10;
            ball.angle = angle;
            if(x) ball.x = x;
            if(y) ball.y = y;
            this.balls.push(ball)
        }
        this.events.next(new PongEvent('POWERUP_BALL_SHOWER', count))
    }

    // Set color filter
    public setColorFilter(filter) {
        this.colorFilter = filter;
        this.screen.drawGame(this);
        this.events.next(new PongEvent('COLOR_FILTER', filter))
    }

    // Load images
    private images: any = {};
    private loadImages() {
        var self = this;
        this.images.bad = new Image();
        this.images.bad.onload = function() {
            self.images.bad = this;
        }
        this.images.bad.src = 'http://cdn.onlinewebfonts.com/svg/download_323449.png'
        // 'https://preview.ibb.co/jkCG0G/aurelijus_veryga_75851909.jpg';
    }

}