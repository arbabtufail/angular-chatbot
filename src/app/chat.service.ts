import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as data from '../assets/messages.json';

export class Message {
  constructor(public author: string, public content: string) {}
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  audioFile = new Audio(
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/success.mp3'
  );
  messageMap: any = data;
  conversation = new Subject<Message[]>();
  constructor() {}
  getBotAnswer(msg: string) {
    const userMessage = new Message('user', msg);
    this.conversation.next([userMessage]);
    const botMessage = new Message('bot', this.getBotMessage(msg));

    setTimeout(() => {
      this.playFile();
      this.conversation.next([botMessage]);
    }, 1500);
  }

  playFile() {
    this.audioFile.play();
  }

  getBotMessage(question: string) {
    const answer = this.messageMap[question];

    return answer || this.messageMap['defaultMessage'];
  }
}
