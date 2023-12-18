import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: string[] = [];
  tempMessages: number[] = [];

  // add(message: string) {
  //   this.messages.push(message);
  // }

  add(message: string, id?: number) {
    if (typeof id !== undefined) {
      this.messages.push(message);
      this.tempMessages.push(id as number);
    }
    // this.messages.push(message);
    console.log(message);
  }
  clear() {
    this.messages = [];
  }
}
