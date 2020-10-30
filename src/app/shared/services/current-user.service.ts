import { Injectable } from '@angular/core';

import { of, Subject, Observable, pipe, BehaviorSubject } from 'rxjs';
import { map, catchError, takeUntil, shareReplay, startWith, tap, take, filter, switchMap } from 'rxjs/operators'; 

// import * as firebase from "firebase/app";
// import { AngularFireAuth } from "@angular/fire/auth";  
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore'; 

import { UserInterface } from 'src/app/shared/model/user';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private currentUserDocSub$ = 
      new BehaviorSubject<AngularFirestoreDocument<UserInterface> | null>(null);

  public currentUser$ = this.currentUserDocSub$.asObservable()
        .pipe(
          filter((userDoc: AngularFirestoreDocument<UserInterface>) => userDoc != null), 
          switchMap((userDoc: AngularFirestoreDocument<UserInterface>) => userDoc.valueChanges()),
          map((user: UserInterface) => {
            user.UUID = this.currentUserId;
            return user;
          }),
          shareReplay(1)
        );
  public currentUser: UserInterface | null = null; 
  public currentUserId: string | null = null; 

  constructor(
    // private readonly ngFireAuth: AngularFireAuth, 
    // private readonly ngFireStore: AngularFirestore, 
  ) { }
  
  selectCurrentUserDoc({userId, userDoc}: {userId: string, userDoc: AngularFirestoreDocument<UserInterface>}) {    
    this.currentUserId = userId;
    this.currentUserDocSub$.next(userDoc);
  }

  // ---------------------- eof ----------------------------------------------
}
