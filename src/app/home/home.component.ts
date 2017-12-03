import { Component, OnInit } from '@angular/core';
import * as packageJson from '../../../package.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  appVersion = (<any>packageJson).version;

  constructor() { }

  ngOnInit() {
  }

}
