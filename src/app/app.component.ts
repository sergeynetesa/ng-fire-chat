import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { Observable } from 'rxjs';
import { map, filter, shareReplay, startWith, tap } from 'rxjs/operators';

// import { AngularFireAuth } from "@angular/fire/auth"; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    trigger('growInOut', [
      state('in', style({ opacity: 1 })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'scale3d(.3, .3, .3)'
        }),
        animate(`150ms ease-in`)
      ]),
      transition('* => void', [
        animate(
          `150ms ease-out`,
          style({
            opacity: 0,
            transform: 'scale3d(.3, .3, .3)'
          })
        )
      ])
    ])
  ],
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  constructor(
    // public readonly ngFireAuth: AngularFireAuth,

    ) {

  }

  ngOnInit() {

    // ----------------- ngOnInit()
  }

}
// --------------------------------------------------------------------------------


