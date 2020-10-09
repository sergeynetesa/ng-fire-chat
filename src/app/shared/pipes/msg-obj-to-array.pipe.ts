import { Pipe, PipeTransform } from '@angular/core';

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
    let result = [];
    for(let p in messageObj) { 
      let msgSrc = messageObj[p].source === 'user' ? userName : 'Therapist';
      result.push({id: p, src: messageObj[p].source, src_name: msgSrc, txt: messageObj[p].text}); 
    }
    result.sort((a, b) => Number.parseFloat(a.id) - Number.parseFloat(b.id));

    return result;    
  }

}
