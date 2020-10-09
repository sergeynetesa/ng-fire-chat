import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';

import { MatSnackBar, MatSnackBarRef, SimpleSnackBar, MatSnackBarDismiss } 
        from '@angular/material/snack-bar'; 

import * as firebase from "firebase/app";
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
  
  @Input('user-type') user_type: string;  
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
    const now_ts = firebase.firestore.Timestamp.fromDate(userDate);

    const day = dayjs(userDate);

    const msgID = `${day.format('YYYY')}-${day.format('MM')}-${day.format('DD')}`; 
    const msgFieldName = `${day.format('HH')}${day.format('mm')}${day.format('ss')}.${day.format('SSS')}`;

    const userMsgDoc: AngularFirestoreDocument<{ [x: string]: { source: string; text: string; }; }> = 
            this.ngFireStore.doc(`users/${this.curUser.UUID}/messages/${msgID}`);

    userMsgDoc.set({ [msgFieldName] : {
            source: this.user_type==='user' ? 'user' : 'therapist',
            text: value.user_message,
          } 
      }, {merge: true})
    .then((_) => {
      console.log("THEN Message Doc updated!");

      const userDoc: AngularFirestoreDocument<Partial <{ 
        name: string; 
        therapist_msg: firebase.firestore.Timestamp; 
        user_msg: firebase.firestore.Timestamp; 
      }>> = 
      this.ngFireStore.doc(`users/${this.curUser.UUID}`);
      
      let obj: Partial<{ // wrong!
        name: string; 
        therapist_msg: firebase.firestore.Timestamp; 
        user_msg: firebase.firestore.Timestamp; 
      }>;

      if (this.user_type==='user') {
        // obj.user_msg = now_ts; // wrong!
        return userDoc.set({user_msg: now_ts}, {merge: true});
      } else {
        // obj.therapist_msg = now_ts; // wrong!
        return userDoc.set({therapist_msg: now_ts}, {merge: true});
      }      
    })
    .then((_) => {
      console.log("THEN User Doc has been updated!");
      
      // this.userFG.setValue({user_message: ''});
      // this.userFG.reset({user_message: ''});
      this.user_message.reset();
    })
    .catch(function(error) {
        console.error("Error updating Message Doc: ", error);
    });
      console.log('<--- SYNC EXIT UserMsgInputComponent.onUserMsgSubmit() --->');      
  }
  getCurMessages() {
    console.log('<--- SYNC ENTER UserMsgInputComponent.getCurMessages() --->');
    
    // const userDate: Date = new Date();      
    // const day = dayjs(userDate);

    // const msgID = `${day.format('YYYY')}-${day.format('MM')}-${day.format('DD')}`; 

    // const userMsgDoc: AngularFirestoreDocument<{ [x: string]: { source: string; text: string; }; }> = 
    //   this.ngFireStore.doc(`users/${this.curUser.UUID}/messages/${msgID}`);

    // const curUserMsg$ = userMsgDoc.valueChanges()
    //   .pipe(
    //     // take(1),
    //     tap(msg => {
    //       console.log('\tPIPE: UserMsgInputComponent.getCurMessages().tap2 msg: %O', msg );           
    //     }),
    //     map(msg => {
    //       let result = [];
    //       for(let p in msg) { 
    //         result.push({id: p, source: msg[p].source, txt: msg[p].text}); 
    //       }
    //       result.sort((a, b) => Number.parseFloat(a.id) - Number.parseFloat(b.id));
    //       return result;
    //     }),
    //     tap(arr => {          
    //       console.log('\tPIPE: UserMsgInputComponent.getCurMessages().tap2 arr: %O', arr );           
    //     }),
    //   );
    
    // const subs = curUserMsg$.subscribe();

    console.log('<--- SYNC EXIT UserMsgInputComponent.getCurMessages() --->'); 
  } 
  // --------------------------eoc -----------------------------------
}
