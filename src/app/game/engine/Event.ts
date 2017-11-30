export class PongEvent {
    public data: any;

    constructor(
        public type: string,
        data?: any
    ) {
        if(data) this.data = data;
    }
}