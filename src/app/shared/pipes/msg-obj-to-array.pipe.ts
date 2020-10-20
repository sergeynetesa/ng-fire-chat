import { Pipe, PipeTransform } from '@angular/core';

import * as dayjs from 'dayjs';
@Pipe({
  name: 'msgObjToArray'
})
export class MsgObjToArrayPipe implements PipeTransform {

  transform(messageObj: {
    [x: string]: {
        source: string;
        text: string;
    };
  }, userName: string): {id: string; src: string; src_name: string; txt: string}[] {
    const day = dayjs();
    const now_str = `${day.format('YYYY')}-${day.format('MM')}-${day.format('DD')}`; 
    const regex = /^(?<h>\d{2})(?<m>\d{2})(?<s>\d{2})\.\d{3}$/;
    const subst = `$1:$2:$3`;

    let result = [];
    for(let p in messageObj) { 
      const now_time = p.replace(regex, subst);
      const now_date = new Date(`${now_str}T${now_time}`);
      const format_time = dayjs(now_date).format('h:mm:ss A');
      let msgSrc = messageObj[p].source === 'user' ? `${userName}, ${format_time}` : `Therapist, ${format_time}`;
      result.push({id: p, src: messageObj[p].source, src_name: msgSrc, txt: messageObj[p].text}); 
    }
    result.sort((a, b) => Number.parseFloat(a.id) - Number.parseFloat(b.id));

    return result;    
  }

}
