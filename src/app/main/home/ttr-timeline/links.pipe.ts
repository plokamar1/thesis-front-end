import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'links'
})
export class LinksPipe implements PipeTransform {

  transform(value: string, arg?: any): any {
    //console.log("hello");
    var reg = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm
    var exp = /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/g;
    const repl = value.replace(reg, '<br><a href="$&">$&</a>');
    
    return repl;
  }
}
