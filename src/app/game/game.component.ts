import { Component, OnInit, ViewChild } from '@angular/core';
import { PongCanvas } from './engine/Canvas';
import { PongGame } from './engine/Game';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { PongEvent } from './engine/Event';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition('void => *', [
        style({opacity: 0}),
        animate(100, style({opacity: 1}))
      ]),
      transition('* => void', [
        animate(100, style({opacity: 0}))
      ])
    ])
  ]
})
export class GameComponent implements OnInit {

  @ViewChild('canvas') canvas;

  private pongCanvas: PongCanvas;
  public pongGame: PongGame;
  public gameWidth: number = 1920;
  public gameHeight: number = 1080;

  public gameRunning: boolean = false;
  public inverted: boolean = false;
  public clickToContinue: boolean = false;

  constructor() { }

  ngOnInit() {
    this.pongCanvas = new PongCanvas(this.canvas.nativeElement, this.gameWidth, this.gameHeight);
    this.pongGame = new PongGame(this.pongCanvas, this.gameWidth, this.gameHeight);
    this.pongGame.events.subscribe((res: PongEvent) => this.handleEvents(res));
    /*
    this.pongGame.events.subscribe(
      res => {
        // Handle events
      }, err => null
    )*/
    this.clickToContinue = true;
    this.gameRunning = true;
  }

  movePaddle(ev) {
    if(!this.gameRunning) return;
    var yproc = ev.layerY / ev.target.offsetHeight;
    this.pongGame.paddle.movePad(yproc);
  }

  toggleMoving(ev) {
    this.gameRunning = this.pongGame.toggleMoving();
    this.inverted = !this.gameRunning;
    this.pongGame.setColorFilter(this.inverted ? 'INVERTED': null);
  }

  toggleInverted() {
    this.inverted = !this.inverted;
    this.pongGame.setColorFilter(this.inverted ? 'INVERTED': null);
  }

  private handleEvents(evt: PongEvent) {
    switch (evt.type) {
      case 'GAME_START':
        this.clickToContinue = false;
        this.gameRunning = true;
        break;
      case 'GAME_STOP':
        // this.gameRunning = false;
        break;
      case 'PLAYER_HIT':
        
        break;
      case 'PLAYER_MISS':
        
        break;
      case 'GAME_LAST_BALL_OUT':
      this.clickToContinue = true;
        break;
      case 'COLOR_FILTER':
        if(evt.data == 'INVERTED') this.inverted = true;
        else if(evt.data == null) this.inverted = false;
        break;
      default:
        break;
    }
  }

}
