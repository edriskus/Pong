import { PongGame } from './Game';

export class PongCanvas {

    private ctx;
    private element;
    private w: number;
    private h: number;

    constructor(element, width, height) {
        this.element = element;
        this.w = width;
        this.h = height;
        this.ctx = element.getContext("2d");
        this.ctx.fillStyle = "#000000";
    }

    drawGame(game: PongGame) {        
        this.ctx.clearRect(0, 0, this.w, this.h);
        for(let b of game.balls) {
            this.ctx.beginPath();
            this.ctx.lineWidth = 0;
            this.ctx.arc(b.x, b.y,b.radius,0,2*Math.PI);
            this.ctx.fillStyle = this.colorFilter(b.color, game.colorFilter);
            this.ctx.fill();
            this.ctx.stroke();
        }
        for(let d in game.drawables) {
            if(game.drawables[d].image) {
                this.ctx.drawImage(game.drawables[d].image, game.drawables[d].x, game.drawables[d].y,game.drawables[d].width, game.drawables[d].height);
            } else {
                this.ctx.beginPath();
                this.ctx.lineWidth = 0;
                this.ctx.rect(game.drawables[d].x, game.drawables[d].y,game.drawables[d].width, game.drawables[d].height);
                this.ctx.fillStyle = this.colorFilter(game.drawables[d].color, game.colorFilter);
                this.ctx.fill();
                this.ctx.stroke();
            }
        }
        for(let p of [game.paddle, game.computer]) {
            this.ctx.beginPath();
            this.ctx.rect(p.x, p.y, p.width, p.height);
            this.ctx.fillStyle = this.colorFilter(p.color, game.colorFilter);
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    colorFilter(color, filter) {
        if(!color) return color;
        switch(filter) {
            case 'INVERTED': return this.invertColor(color);
            default: return color;
        }
    }

    // From https://jsfiddle.net/salman/f9Re3/
    invertColor(hexTripletColor) {
        var color = hexTripletColor;
        color = color.substring(1); // remove #
        color = parseInt(color, 16); // convert to integer
        color = 0xFFFFFF ^ color; // invert three bytes
        color = color.toString(16); // convert to hex
        color = ("000000" + color).slice(-6); // pad with leading zeros
        color = "#" + color; // prepend #
        return color;
    }

}