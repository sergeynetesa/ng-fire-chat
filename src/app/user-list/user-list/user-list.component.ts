import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { Observable } from 'rxjs';
import { tap, map, filter, switchMap } from 'rxjs/operators'; 

import { MatSnackBar, SimpleSnackBar, MatSnackBarRef,
  MatSnackBarDismiss} from '@angular/material/snack-bar';

import * as firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";  
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'; 

import * as dayjs from 'dayjs';

import { UserInterface } from 'src/app/shared/model/user';
import { CurrentUserService } from 'src/app/shared/services/current-user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
  // users = Array.from({length: 25}, (_, i) => `User ${++i}`);

  public currentUserList$: Observable<UserInterface[]> = null; 
  public curUserId: string = null; 

  constructor(
    private readonly ngFireAuth: AngularFireAuth, 
    private readonly ngFireStore: AngularFirestore,
    public currentUserSrv: CurrentUserService,  
    private snackBarSrv: MatSnackBar 
  ) { }

  ngOnInit(): void {
    const usersRef = this.ngFireStore.collection<UserInterface>('users', 
                ref => ref.orderBy('therapist_msg')); 
                
    this.currentUserList$ = usersRef.valueChanges({idField: 'UUID'})              
  }

  selectUser(user: UserInterface) {
    console.log('<--- SYNC ENTER UserListComponent.selectUser() user: $O', user);
    
    const userDoc: AngularFirestoreDocument<UserInterface> = 
      this.ngFireStore.doc(`users/${user.UUID}`);

    this.curUserId = user.UUID;
    this.currentUserSrv.selectCurrentUserDoc({userId: user.UUID, userDoc});
  }
  
  userNameGet(user: UserInterface): string {
    if (user.therapist_msg.isEqual(user.user_msg)) {
      return user.name;
    } else {
        return `${user.name} - Unread`;
    }
  }
  
  private createUserOrderNumber() {
    console.log("<--- SYNC ENTER UserListComponent.createUserOrderNumber() --->");
    
    let db: firebase.firestore.Firestore = null;
    let next_user_number = -1;

    this.ngFireAuth.app
    .then((app: firebase.app.App) => {      
      // console.log('then firebase.app.App app: %O', app);
      db = app.firestore();
      const orderSeedRef = db.collection("user-order-seed").doc("order-number");
      return orderSeedRef.get();
    })
    .then((doc: firebase.firestore.DocumentSnapshot) => {
      if (doc.exists) {
          console.log("THEN Document data:", doc.data());
          const user_number_obj: any = doc.data();
          return {
            order_number_ref : doc.ref, 
            user_number : user_number_obj.current_value
          };
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    })
    .then((obj: any) => {
      console.log("THEN Current User Order Number:", obj.user_number);
      
      next_user_number = obj.user_number + 1;
      return obj.order_number_ref.update({
        current_value : next_user_number
      });      
    })
    .then((_) => {
      console.log("THEN Current User Order Number has been incremented!", next_user_number);
      this.createUserInDB(next_user_number, db);
    })
    .catch( error => {
      console.log('catch firebase.app.App error: %O', error);
    });    
    
    console.log("<--- SYNC EXIT UserListComponent.createUserOrderNumber() --->");
  }

  private createUserInDB(user_number: number, db: firebase.firestore.Firestore) {
    console.log('<--- SYNC ENTER UserListComponent.createUserInDB() user_number:', user_number );
    
    const zeroDate = new Date('01 Jan 1970 00:00:00 GMT');
    const nowDate = new Date();

    const zero_ts = firebase.firestore.Timestamp.fromDate(zeroDate);
    const now_ts = firebase.firestore.Timestamp.fromDate(nowDate);

    db.collection("users").add({
      name: `User ${user_number}`,
      therapist_msg: now_ts,
      user_msg: zero_ts, 
  })
  .then((docRef: firebase.firestore.DocumentReference) => {
    console.log("THEN Document written with ID: %s ", docRef.id);
    
    const therapistDate: Date = nowDate;      
    const day = dayjs(therapistDate);

    const msgID = `${day.format('YYYY')}-${day.format('MM')}-${day.format('DD')}`; 
    const msgFieldName = `${day.format('HH')}${day.format('mm')}${day.format('ss')}.${day.format('SSS')}`;

    return db.collection(`${docRef.path}/messages`)
      .doc(msgID)
      .set({ [msgFieldName] : {
            source: 'therapist',
            text: 'Welcome to our system.'
          }          
      });
  })
  .then((_) => {
    console.log("THEN Message has been added!");
    
  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
  });
  }

  createUser() {
    console.log('<--- SYNC ENTER UserListComponent.createUser() --->');
    this.createUserOrderNumber();
    console.log('<--- SYNC EXIT UserListComponent.createUser() --->');
  }

  markRead() {
    // console.log('<--- SYNC ENTER UserListComponent.markRead() --->');
    
    const now_ts = firebase.firestore.Timestamp.now();

    const userDoc: AngularFirestoreDocument<Partial <{ 
      name: string; 
      therapist_msg: firebase.firestore.Timestamp; 
      user_msg: firebase.firestore.Timestamp; 
    }>> = this.ngFireStore.doc(`users/${this.curUserId}`);

    userDoc.set({therapist_msg: now_ts, user_msg: now_ts}, {merge: true})    
    .then((_) => {
      console.log("THEN User Doc has been updated!");      
    })
    .catch(function(error) {
        console.error("Error updating document: ", error);
    });
    // console.log('<--- SYNC EXIT UserListComponent.markRead() --->');
  }
  // ---------------------------eoc -------------------------------------------
}
