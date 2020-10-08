import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Observable } from 'rxjs';

import { UserInterface } from 'src/app/shared/model/user';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainContainerComponent implements OnInit {
  public curUser$: Observable<UserInterface|null> = null; 

  constructor(
    public currentUserSrv: CurrentUserService,
  ) { }

  ngOnInit(): void {
    this.curUser$ = this.currentUserSrv.currentUser$;
  }

  
// ---------------------------------------
}
