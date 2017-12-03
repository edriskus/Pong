import { Collider } from "./Collider";

describe('PongEngineCollider', () => {
  let instance: Collider;
  let x = 0;
  let y = 5;
  let width = 1920;
  let height = 1;

  beforeEach(() => {
    instance = new Collider(x, y, width, height)
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should reflect collision angle', () => {
    let collision = instance.collide(500, 500, 0, 10, 315, null);
    if(collision) {
      expect(collision).toBeTruthy();
      expect(collision).toEqual(-315);
    } else {
      fail("collision undefined")
    }
  });

});
