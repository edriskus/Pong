import { Collider } from './Collider';

/*
    Pong Game Trigger class. 
*/
export class Trigger extends Collider {

    constructor(
        public x: number, 
        public y: number, 
        public width: number, 
        public height: number,
        public callbackFunction: Function
    ) {
        super(x, y, width, height);
    }

    // Inherited from Collider and overloaded
    public collide(x: number, prevx: number, y: number, prevy: number, angle: number, item: any) {
        
        if(prevx < this.x && x < this.x) return null;
        if(prevx > (this.x + this.width) && x > (this.x + this.width)) return null;
        if(prevy < this.y && y < this.y) return null;
        if(prevy > (this.y + this.height) && y > (this.y + this.height)) return null;

        if(prevy < this.y && y >= this.y) { return this.callbackFunction(item, x, prevx, y, prevy, angle, 'YT')/* y from top */}
        else if(prevy > (this.y + this.height) && y <= (this.y + this.height)) { return this.callbackFunction(item, x, prevx, y, prevy, angle, 'YB') /* y from bottom */}

        if(prevx < this.x && x >= this.x) { return this.callbackFunction(item, x, prevx, y, prevy, angle, 'XL') /* x from left only */}
        else if(prevx > (this.x + this.width) && x <= (this.x + this.width)) { return this.callbackFunction(item, x, prevx, y, prevy, angle, 'XR') /* x from right */}
    }
}