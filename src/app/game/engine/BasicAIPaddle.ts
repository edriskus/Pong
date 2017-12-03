import { PongPaddle } from './Paddle';
import { PongGame } from './Game';

/*
    Pong Game AI Paddle class. 
*/
export class PongBasicAIPaddle extends PongPaddle {

    // Basic AI Paddle properties
    public y: number = 0;
    public x: number;
    public height: number;
    public score: number = 0;
    public width: number;
    public color: string = '#000000';
    public observedBall: any;
    public target: number;
    public speed: number;

    constructor(
      gameWidth: number, 
      gameHeight: number, 
      game: PongGame,
      height?,
      public dumbness: number = 0.5
    ) {
      super(gameWidth, gameHeight, game, height);
      this.x = 3 * (gameWidth / 130);
    }

    // Observe a ball and then target its predicted position
    public observeBall(ball) {
      this.observedBall = {
        x: ball.x,
        y: ball.y,
        ball: ball
      }
      var accuracy = 5;
      setTimeout(() => {
        this.targetBall(accuracy);
      }, accuracy * 20);
    }

    // Target ball after an amount of observed frames
    public targetBall(frames) {
      if(!this.observedBall) return;
      var ball = this.observedBall.ball;
      var speedX = this.observedBall.x - ball.x;
      if(speedX < 0) {
        this.observedBall = null;
        return;
      }
      var distance = ball.x - this.x - this.width - speedX;
      var speedY = ball.y - this.observedBall.y;
      var target = ball.y;
      var count = -1;      
      
      while(distance >= 0) {
        count++;
        distance -= speedX;
        target += speedY;
        if(target < 0 || target >= this.gameHeight) {
          speedY *= (-1);
          target += speedY;
        }        
      }
      target *= 1 + ((Math.random() - .5) / 50 * this.dumbness)
      count -= (Math.floor(Math.random() * 3 * this.dumbness))
      this.setTarget(target, count * frames);
      this.observedBall = null;
    } 

    // Move to % of game height
    public moveTo = (val) => {      
      if(val * this.gameHeight < Math.floor(this.height/2)) {
        this.y = 0;
      } else if(val * this.gameHeight > this.gameHeight - 1 - Math.floor(this.height/2)) {
        this.y = this.gameHeight - 1 - this.height;
      } else {
        this.y = val * this.gameHeight - Math.floor(this.height/2);
      }
    }

    // Set a target to move to over a period of time
    public setTarget = (target, frames) => {      
      this.target = target;
      this.speed = ( this.target - (this.y + Math.floor(this.height/2)) ) / (frames || 1);
    }

    // Move to target (if exists) every frame
    public moveToTarget = () => {
      if(this.target == null || this.speed == null) return;
      let newy = this.y + this.speed + Math.floor(this.height/2);
      if((newy - this.target > 0 && this.y + Math.floor(this.height/2) - this.target <= 0) ||
        (newy - this.target < 0 && this.y + Math.floor(this.height/2) - this.target >= 0)) {
          this.target = null;
          this.speed = null;
          return;
        }              
      this.moveTo((newy) / this.gameHeight);
    }

    // Inherited from Collider and overloaded
    public collide(x: number, prevx: number, y: number, prevy: number, angle: number, item: any) {
      var response = this.colliderFunction(x, prevx, y, prevy, angle);
      if(response != null) {
        let ywhere = (y - this.y) / this.height;
        /*
        if(ywhere > .5) {
          response += 45 * (ywhere - .5);
        } else {
          response -= 45 * ywhere;
        }
        */
        response = (ywhere) * 180 - 90;
        if(response > 60) response = 60;
        if(response < -60) response = -60;
      } 
      return response;
    }
}