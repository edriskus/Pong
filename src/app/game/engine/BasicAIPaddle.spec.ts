import { PongBasicAIPaddle } from './BasicAIPaddle';

describe('PongEngineAIPaddle', () => {
  let instance: PongBasicAIPaddle;
  let width = 1920;
  let height = 1080;
  let fakeGame: any = {
    colliders: []
  }

  beforeEach(() => {
    instance = new PongBasicAIPaddle(width, height, fakeGame)
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should observe a ball', () => {
    let ball = { x: 500, y: 500, ball: { x: 600, y: 600 } };
    instance.observeBall(ball);
    expect(instance.observedBall).toBeTruthy();
    setTimeout(() => {
      expect(instance.target).toBeTruthy();
      expect(instance.speed).toBeTruthy();
      expect(instance.observedBall).toBeFalsy();
      expect(instance.target).toEqual(1);
      expect(instance.speed).toEqual(1);      
    }, 120);
  });

});
