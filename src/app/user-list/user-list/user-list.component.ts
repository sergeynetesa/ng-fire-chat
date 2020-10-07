import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent implements OnInit {
  users = Array.from({length: 25}, (_, i) => `User ${++i}`);

  constructor() { }

  ngOnInit(): void {
  }

  selectUser(user) {
    console.log(user)
  }
}
