import { PongBall } from './Ball';
import { PongGame } from './Game';

describe('PongEngineBall', () => {
  let instance: PongBall;
  let width = 1920;
  let height = 1080;
  let speed = 40;
  let fakeGame: any = {
    colliders: []
  }

  beforeEach(() => {
    instance = new PongBall(width, height, speed, fakeGame)
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should move', () => {
    instance.angle = 180;
    instance.speed = 50;
    instance.x = 500;
    instance.y = 500;
    instance.move();
    expect(instance.angle).toEqual(180);
    expect(instance.x).toEqual(450)
    expect(instance.y).toEqual(500)
  });

  it('should find new point', () => {
    let point = instance.findNewPoint(500, 500, 0, 100);
    expect(point.x).toEqual(600);
    expect(point.y).toEqual(500);
    point = instance.findNewPoint(500, 500, 90, 100);
    expect(point.x).toEqual(500);
    expect(point.y).toEqual(600);
    point = instance.findNewPoint(500, 500, 180, 100);
    expect(point.x).toEqual(400);
    expect(point.y).toEqual(500);
    point = instance.findNewPoint(500, 500, 270, 100);
    expect(point.x).toEqual(500);
    expect(point.y).toEqual(400);
  })

});
