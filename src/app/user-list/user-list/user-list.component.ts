import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { MatSnackBar, SimpleSnackBar, MatSnackBarRef,
  MatSnackBarDismiss} from '@angular/material/snack-bar';

import * as firebase from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";  
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'; 

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
  users = Array.from({length: 25}, (_, i) => `User ${++i}`);

  constructor(
    private readonly ngFireAuth: AngularFireAuth, 
    private readonly ngFireStore: AngularFirestore,     
    private snackBarSrv: MatSnackBar 
  ) { }

  ngOnInit(): void {
  }

  selectUser(user) {
    console.log(user);
  }
  // /user-order-seed/order-number
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
    
    const ts = firebase.firestore.FieldValue.serverTimestamp(); 

    db.collection("users").add({
      name: `User ${user_number}`,
      therapist_msg: ts,
      user_msg: null 
  })
  .then((docRef: firebase.firestore.DocumentReference) => {
    console.log("THEN Document written with ID: %s ", docRef.id);
    return docRef.get();
  })
  .then((doc: firebase.firestore.DocumentSnapshot) => {
    if (doc.exists) {
      const obj: any = doc.data();
      const therapistDate: Date = obj.therapist_msg.toDate();
      
      console.log("THEN Document data: %O date: %s path: %s", obj, therapistDate, doc.ref.path);
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
      const messageID =  `${hourFormat.format(therapistDate)}${minuteFormat.format(therapistDate)}${secondFormat.format(therapistDate)}.${therapistDate.getMilliseconds()}`;
      db.collection(`${doc.ref.path}/messages`)
        .doc(`${yearFormat.format(therapistDate)}-${monthFormat.format(therapistDate)}-${dayFormat.format(therapistDate)}`)
        .set({ [messageID] : {
              source: 'therapist',
              text: 'Welcome to our system.'
            }          
        });
      
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
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

  // ---------------------------eoc -------------------------------------------
}
