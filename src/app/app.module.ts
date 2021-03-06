import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {AngularFireModule} from "@angular/fire";
import {AngularFirestoreModule, SETTINGS} from "@angular/fire/firestore"; 

import { NgMaterialModule } from './ng-material.module';

import { AppRoutingModule } from './app-routing.module'; 

import {environment} from '../environments/environment'; 
  
import { AppComponent } from './app.component';
import { MainContainerComponent } from './home/main-container/main-container.component';
import { UserMsgInputComponent } from './user/user-msg-input/user-msg-input.component';
import { UserChatComponent } from './user/user-chat/user-chat.component';
import { UserListComponent } from './user-list/user-list/user-list.component';

import { MsgObjToArrayPipe } from './shared/pipes/msg-obj-to-array.pipe';
import { TopMenuComponent } from './home/top-menu/top-menu.component';
import { PageNotFoundComponent } from './page-not-found.component';
import { AppDetailsComponent } from './home/app-details/app-details.component';
import { AppSpecComponent } from './home/app-spec/app-spec.component';

@NgModule({
  declarations: [
    AppComponent,
    MainContainerComponent,
    UserMsgInputComponent,
    UserChatComponent,
    UserListComponent,
    MsgObjToArrayPipe,
    TopMenuComponent,
    PageNotFoundComponent,
    AppDetailsComponent,
    AppSpecComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    
    FormsModule,
    ReactiveFormsModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,

    NgMaterialModule,
    AppRoutingModule,
    
  ],
  providers: [

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
