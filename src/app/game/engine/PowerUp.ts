import { Trigger } from './Trigger';

/*
    Pong Game PowerUp class. 
*/
export class PowerUp extends Trigger {

    constructor(
        public x: number, 
        public y: number, 
        public width: number, 
        public height: number,
        public callbackFunction: Function,
        public color: string = '#ededed',
        public image: any = null
    ) {
        super(x, y, width, height, callbackFunction);
    }

}