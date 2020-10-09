import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-user-chat',
  templateUrl: './user-chat.component.html',
  styleUrls: ['./user-chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserChatComponent implements OnInit {
  
  @Input('data-source') messages: {id: string; src: string; src_name: string; txt: string}[];  
  @Input('user-type') user_type: string;

  constructor() { }

  ngOnInit(): void {
  }
  getTextAlign(msg: {id: string; src: string; src_name: string; txt: string}) {
    if (this.user_type==='user') {
      return (msg.src==='user')?'right':'left';
    } else {
      return (msg.src==='user')?'left':'right';
    }

  }
}
