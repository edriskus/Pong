import { PongGame } from "./Game";

const deltaMod = 0.25;

/*
    Pong Game ball class. 
*/
export class PongBall {

    // Ball properties    
    public angle: number = 120;
    public x: number = 0;
    public y: number = 0;
    public radius: number;
    public color: string = '#000000';

    constructor(
        private width: number, 
        private height: number, 
        public speed: number, 
        private game: PongGame
    ) {
        this.radius = width / 130;
        this.x = width / 2;
        this.y = height / 2;
        this.speed = speed;
    }

    // Angle formatting tools
    private formattedAngle(angle) {
        angle = Math.abs(angle);
        angle = angle % 180;
        if(angle / 90 > 1) {
            return 1 + (deltaMod - ((angle % 90) / 90) * deltaMod);
        } else {
            return 1 + angle / 90 * deltaMod;
        }                
    }

    private formattedSpeed(speed, angle) {
        return this.formattedAngle(angle) * speed
        // return this.speed;
    }

    private normalizeAngle(angle: number): number {
        return angle % 360;
    }

    // Move on every frame
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

    // Try to collide game colliders
    public collide(x, y, angle): number {
        var key, collision;
        for(key in this.game.colliders) {
            collision = this.game.colliders[key].collide(x, this.x, y, this.y, angle, this);            
            if(collision != null) return collision;
        }
        return null;
    }

    // Find new point by current coords, angle and distance
    public findNewPoint(x, y, angle, distance) {
        var result: any = {};
    
        result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + x);
        result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + y);

        return result;
    }
}