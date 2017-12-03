/*
    Pong Game Collider class. 
*/
export class Collider {

    constructor(
        public x: number, 
        public y: number, 
        public width: number, 
        public height: number
    ) {}

    // Try to collide an item at given coords with this
    public collide(x: number, prevx: number, y: number, prevy: number, angle: number, item: any) {
        
        if(prevx < this.x && x < this.x) return null;
        if(prevx > (this.x + this.width) && x > (this.x + this.width)) return null;
        if(prevy < this.y && y < this.y) return null;
        if(prevy > (this.y + this.height) && y > (this.y + this.height)) return null;

        if(prevy < this.y && y >= this.y) { return this.mirrorY(angle)/* y from top */}
        else if(prevy > (this.y + this.height) && y <= (this.y + this.height)) { return this.mirrorY(angle) /* y from bottom */}

        if(prevx < this.x && x >= this.x) { return this.mirrorX(angle) /* x from left only */}
        else if(prevx > (this.x + this.width) && x <= (this.x + this.width)) { return this.mirrorX(angle) /* x from right */}

        return null;
    }

    // Reflect angle on X axis
    protected mirrorX(angle) {
        return 180 - angle;
    }

    // Reflect angle on Y axis
    protected mirrorY(angle) {
        return (-1) * angle;
    }
}