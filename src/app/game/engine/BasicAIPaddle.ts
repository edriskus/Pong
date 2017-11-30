import { PongPaddle } from './Paddle';

export class PongBasicAIPaddle extends PongPaddle {
    public startheight: number;
    public y: number = 0;
    public x: number;
    public height: number;
    public score: number = 0;
    public width: number;
    public color: string = '#000000';

    constructor(
      gameWidth: number, 
      gameHeight: number, 
      drawGame: Function, 
      height?
    ) {
      super(gameWidth, gameHeight, drawGame, height);
      this.x = 3 * (gameWidth / 130);
    }

    // Move paddle function
    public movePad = (game) => {
      var val = (game.balls[0].y) / this.gameHeight;
      if(val * this.gameHeight < Math.floor(this.height/2)) {
        this.y = 0;
      } else if(val * this.gameHeight > this.gameHeight - 1 - Math.floor(this.height/2)) {
        this.y = this.gameHeight - 1 - this.height;
      } else {
        this.y = val * this.gameHeight - Math.floor(this.height/2);
      }
    }

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