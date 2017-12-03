import { PongCanvas } from './Canvas';

describe('PongEngineCanvas', () => {
  let instance: PongCanvas;
  let width = 1920;
  let height = 1080;
  let fakeCtx: any = {
    getContext: () => { return {} }
  };
  let fakeGame: any = {
    colliders: []
  }

  beforeEach(() => {
    instance = new PongCanvas(fakeCtx, width, height)
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });

  it('should calculate inverted colors', () => {
    expect(instance.invertColor('#ffffff')).toEqual('#000000');
    expect(instance.invertColor('#000000')).toEqual('#ffffff');
    expect(instance.invertColor('#0f0f0f')).toEqual('#f0f0f0');
  });

});
