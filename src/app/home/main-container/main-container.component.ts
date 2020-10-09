import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Observable } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

import { UserInterface } from 'src/app/shared/model/user';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'; 

import * as dayjs from 'dayjs';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainContainerComponent implements OnInit {

  public curUser$: Observable<UserInterface|null> = null; 
  public curUser: UserInterface | null = null; 
  
  public curUserMsg$: Observable<{
    [x: string]: {
        source: string;
        text: string;
    };
  }> = null;

  constructor(
    private readonly ngFireStore: AngularFirestore,
    public currentUserSrv: CurrentUserService,

  ) { }

  ngOnInit(): void {

    this.curUser$ = this.currentUserSrv.currentUser$
    .pipe(
      filter((user: UserInterface) => user != null),
      tap((user: UserInterface) => {
        console.log('\tPIPE: MainContainerComponent.ngOnInit().tap user: %O', user); 
        this.curUser = user;
      })
    );

    this.curUserMsg$ = this.currentUserSrv.currentUser$
    .pipe(
      filter((user: UserInterface) => user != null),
      switchMap((user: UserInterface) => {
        // console.log('\tPIPE: MainContainerComponent.ngOnInit().switchMap user: %O', user); 
        
        const day = dayjs();
        const msgID = `${day.format('YYYY')}-${day.format('MM')}-${day.format('DD')}`; 
    
        const userMsgDoc: AngularFirestoreDocument<{ 
            [x: string]: { source: string; text: string; }
          }> = this.ngFireStore.doc(`users/${this.curUser.UUID}/messages/${msgID}`);
        
        return  userMsgDoc.valueChanges();
      })
    );
    

  }

  
// ---------------------------------------
}
