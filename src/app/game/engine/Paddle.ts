import { Collider } from './Collider';
import { PongGame } from './Game';

/*
    Pong Game Paddle class. 
*/
export class PongPaddle extends Collider {
    public startheight: number;
    public y: number = 0;
    public x: number;
    public height: number;
    public score: number = 0;
    public width: number;
    public color: string = '#000000';

    constructor(
      protected gameWidth: number, 
      protected gameHeight: number, 
      public game: PongGame,
      height?
    ) {
      super(gameWidth - 4 * (gameWidth / 130), 0, gameWidth / 130, (height ? height * gameHeight : 0.35 * gameHeight));
    }

    // Move paddle function
    public movePad = (val) => {
      if(val == 'UP') {
        if(this.y > 0) {
          this.y--;
        }
      } else if(val == 'DOWN') {
        if(this.y < this.gameHeight-this.height) {
          this.y--;
        }
      } else {
        // A % of gameHeight is given
        if(val * this.gameHeight < Math.floor(this.height/2)) {
          this.y = 0;
        } else if(val * this.gameHeight > this.gameHeight - 1 - Math.floor(this.height/2)) {
          this.y = this.gameHeight - 1 - this.height;
        } else {
          this.y = val * this.gameHeight - Math.floor(this.height/2);
        }
      }
    }

    // Extracted from collide to simplify things
    protected colliderFunction(x: number, prevx: number, y: number, prevy: number, angle: number) {
      if(prevx < this.x && x < this.x) return null;
      if(prevx > (this.x + this.width) && x > (this.x + this.width)) return null;
      if(prevy < this.y && y < this.y) return null;
      if(prevy > (this.y + this.height) && y > (this.y + this.height)) return null;

      if(prevy < this.y && y >= this.y) { return this.mirrorY(angle)/* y from top */}
      else if(prevy > (this.y + this.height) && y <= (this.y + this.height)) { return this.mirrorY(angle) /* y from bottom */}

      if(prevx < this.x && x >= this.x) { return this.mirrorX(angle) /* x from left only */}
      else if(prevx > (this.x + this.width) && x <= (this.x + this.width)) { return this.mirrorX(angle) /* x from right */}
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
        response = (1 - ywhere) * 180 + 90;
        if(response < 120) response = 120;
        if(response > 240) response = 240;
        if(this.game.balls[0] === item) this.game.observeBall();
      }       
      return response;
    }

}