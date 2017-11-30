import { PongGame } from "./Game";

const deltaMod = 0.25;

export class PongBall {

    // Ball properties
    private dirX: string = 'RIGHT';
    private dirY: string = 'DOWN';
    
    public angle: number = 120;
    public x: number = 0;
    public y: number = 0;
    public radius: number;
    public color: string = '#000000';

    constructor(
        private width: number, 
        private height: number, 
        private speed: number, 
        private game: PongGame
    ) {
        this.radius = width / 130;
        this.x = width / 2;
        this.y = height / 2;
        this.speed = speed;
        var w: any = window; w.pongGameBall = this;
    }

    formattedAngle(angle) {
        angle = Math.abs(angle);
        angle = angle % 180;
        if(angle / 90 > 1) {
            return 1 + (deltaMod - ((angle % 90) / 90) * deltaMod);
        } else {
            return 1 + angle / 90 * deltaMod;
        }                
    }

    formattedSpeed(speed, angle) {
        return this.formattedAngle(angle) * speed
        // return this.speed;
    }

    normalizeAngle(angle: number): number {
        return angle % 360;
    }

    public move(count: number = 1) {
        let coords = this.findNewPoint(this.x, this.y, this.angle, this.formattedSpeed(this.speed, this.angle));
        this.angle = this.normalizeAngle(this.angle);
                
        let collision: number = this.collide(coords.x, coords.y, this.angle)
        if(collision != null && count < 5) {
            this.angle = collision;
            return this.move(++count);
        } else {
            this.x = coords.x;
            this.y = coords.y;
        }
    }

    public collide(x, y, angle): number {
        var key, collision;
        for(key in this.game.colliders) {
            collision = this.game.colliders[key].collide(x, this.x, y, this.y, angle, this);            
            if(collision != null) return collision;
        }
        return null;
    }

    private findNewPoint(x, y, angle, distance) {
        var result: any = {};
    
        result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + x);
        result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + y);

        return result;
    }
}