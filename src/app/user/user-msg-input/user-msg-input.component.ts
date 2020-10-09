import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

import { MatSnackBar, MatSnackBarRef, SimpleSnackBar, MatSnackBarDismiss } 
        from '@angular/material/snack-bar'; 

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'; 

import * as dayjs from 'dayjs';

import { UserInterface } from 'src/app/shared/model/user';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';
        
@Component({
  selector: 'app-user-msg-input',
  templateUrl: './user-msg-input.component.html',
  styleUrls: ['./user-msg-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMsgInputComponent implements OnInit {
  userFG: FormGroup;
  
  public curUser$: Observable<UserInterface|null> = null; 
  public curUser: UserInterface | null = null; 

  get user_message() { return this.userFG.get('user_message'); } 
  // --------------------------------------------------------------
  private simpleSnackBarRef: MatSnackBarRef<SimpleSnackBar> = null;
  
  // -------------------------------------------------------------- 

  constructor(
    private fb: FormBuilder,
    private snackBarSrv: MatSnackBar,
    private readonly ngFireStore: AngularFirestore,
    public currentUserSrv: CurrentUserService,
  ) { }

  ngOnInit(): void {
    this.userFG = this.fb.group({
      user_message: ['', {
        validators: [
          Validators.required,
          Validators.minLength(3)
        ],
        updateOn: 'change' }
      ],
    });
    
    this.curUser$ = this.currentUserSrv.currentUser$
    .pipe(
      filter((user: UserInterface) => user != null),
      tap((user: UserInterface) => {
        console.log('\tPIPE: UserMsgInputComponent.ngOnInit().tap user: %O', user); 
        this.curUser = user;

      })
    );

    // --------------- eom ------------------------------
  }

  onUserMsgSubmit({ value, valid }: { value: any, valid: boolean }) {
    console.log('<--- SYNC ENTER UserMsgInputComponent.onUserMsgSubmit() --->');
    if (!valid) {      
      console.log('<--- SYNC ERROR UserMsgInputComponent.onUserMsgSubmit(): invalid form!');
      return;
    }
    const userDate: Date = new Date();      
    const day = dayjs(userDate);

    // const yearFormat = new Intl.DateTimeFormat("en" , {
    //   year: "numeric", 
    //  });
    //  const monthFormat = new Intl.DateTimeFormat("en" , {
    //   month:"2-digit",
    //  });
    //  const dayFormat = new Intl.DateTimeFormat("en" , {
    //   day: "2-digit"
    //  });

    //  const hourFormat = new Intl.DateTimeFormat("en" , {
    //   hour12: false,   // hourCycle: 'h23',
    //   hour: "2-digit"
    //  });     
    //  const minuteFormat = new Intl.DateTimeFormat("en" , {
    //   minute: "2-digit"
    //  });
    //  const secondFormat = new Intl.DateTimeFormat("en" , {
    //   second: "2-digit"
    //  });
    
    // const msgID = `${yearFormat.format(userDate)}-${monthFormat.format(userDate)}-${dayFormat.format(userDate)}`; 
    // const msgFieldName = `${hourFormat.format(userDate)}${minuteFormat.format(userDate)}${secondFormat.format(userDate)}.${userDate.getMilliseconds()}`;
    
    const msgID = `${day.format('YYYY')}-${day.format('MM')}-${day.format('DD')}`; 
    const msgFieldName = `${day.format('HH')}${day.format('mm')}${day.format('ss')}.${day.format('SSS')}`;

    const userMsgDoc: AngularFirestoreDocument<{ [x: string]: { source: string; text: string; }; }> = 
            this.ngFireStore.doc(`users/${this.curUser.UUID}/messages/${msgID}`);

    userMsgDoc.set({ [msgFieldName] : {
            source: 'user',
            text: value.user_message,
          } 
      }, {merge: true})
    .then((_) => {
      console.log("THEN Message Doc updated!");      
    })
    .catch(function(error) {
        console.error("Error updating Message Doc: ", error);
    });
      console.log('<--- SYNC EXIT UserMsgInputComponent.onUserMsgSubmit() --->');      
  }
  getCurMessages() {
    console.log('<--- SYNC ENTER UserMsgInputComponent.getCurMessages() --->');
    
    const userDate: Date = new Date();      
    const day = dayjs(userDate);

    // const yearFormat = new Intl.DateTimeFormat("en" , {
    //   year: "numeric", 
    //  });
    //  const monthFormat = new Intl.DateTimeFormat("en" , {
    //   month:"2-digit",
    //  });
    //  const dayFormat = new Intl.DateTimeFormat("en" , {
    //   day: "2-digit"
    //  });
    // const msgID = `${yearFormat.format(userDate)}-${monthFormat.format(userDate)}-${dayFormat.format(userDate)}`; 
    
    const msgID = `${day.format('YYYY')}-${day.format('MM')}-${day.format('DD')}`; 

    const userMsgDoc: AngularFirestoreDocument<{ [x: string]: { source: string; text: string; }; }> = 
      this.ngFireStore.doc(`users/${this.curUser.UUID}/messages/${msgID}`);

    const curUserMsg$ = userMsgDoc.valueChanges()
      .pipe(
        // take(1),
        tap(msg => {
          console.log('\tPIPE: UserMsgInputComponent.getCurMessages().tap2 msg: %O', msg );           
        }),
        map(msg => {
          let result = [];
          for(let p in msg) { 
            result.push({id: p, source: msg[p].source, txt: msg[p].text}); 
          }
          result.sort((a, b) => Number.parseFloat(a.id) - Number.parseFloat(b.id));
          return result;
        }),
        tap(arr => {          
          console.log('\tPIPE: UserMsgInputComponent.getCurMessages().tap2 arr: %O', arr );           
        }),
      );
    
    const subs = curUserMsg$.subscribe();

    console.log('<--- SYNC EXIT UserMsgInputComponent.getCurMessages() --->'); 
  } 
  // --------------------------eoc -----------------------------------
}
