import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { MatSnackBar, MatSnackBarRef, SimpleSnackBar, MatSnackBarDismiss } 
        from '@angular/material/snack-bar'; 

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'; 

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
    
    const yearFormat = new Intl.DateTimeFormat("en" , {
      year: "numeric", 
     });
     const monthFormat = new Intl.DateTimeFormat("en" , {
      month:"2-digit",
     });
     const dayFormat = new Intl.DateTimeFormat("en" , {
      day: "2-digit"
     });
     const hourFormat = new Intl.DateTimeFormat("en" , {
      hour12: false,
      hour: "2-digit"
     });
     const minuteFormat = new Intl.DateTimeFormat("en" , {
      minute: "2-digit"
     });
     const secondFormat = new Intl.DateTimeFormat("en" , {
      second: "2-digit"
     });
    const msgID = `${yearFormat.format(userDate)}-${monthFormat.format(userDate)}-${dayFormat.format(userDate)}`; 
    const msgFieldName = `${hourFormat.format(userDate)}${minuteFormat.format(userDate)}${secondFormat.format(userDate)}.${userDate.getMilliseconds()}`;
    // const msgFieldName1 = `${hourFormat.format(userDate)}${minuteFormat.format(userDate)}${secondFormat.format(userDate)}`;
    // const msgFieldName2 = `${userDate.getMilliseconds()}`;
    
    const userMsgDoc: AngularFirestoreDocument<{ [x: string]: { source: string; text: string; }; }> = 
            this.ngFireStore.doc(`users/${this.curUser.UUID}/messages/${msgID}`);

    userMsgDoc.set({ [msgFieldName] : {
            source: 'user',
            text: value.user_message
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
}
