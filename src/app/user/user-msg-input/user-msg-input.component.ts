import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { MatSnackBar, MatSnackBarRef, SimpleSnackBar, MatSnackBarDismiss } 
        from '@angular/material/snack-bar'; 

@Component({
  selector: 'app-user-msg-input',
  templateUrl: './user-msg-input.component.html',
  styleUrls: ['./user-msg-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserMsgInputComponent implements OnInit {
  userFG: FormGroup;

  get user_message() { return this.userFG.get('user_message'); } 
  
  constructor(
    private fb: FormBuilder,
    private snackBarSrv: MatSnackBar,
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
  }

  onUserMsgSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {      
      // this.userSrv.signupUser(value.signup_email, value.signup_name, this.userStateSrv);
    }
  } 
}
