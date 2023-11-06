import { Component, OnInit } from '@angular/core';
import { ChatService, Message } from '../chat.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent implements OnInit {
  messages: Message[] = [];
  value: string | null = null;
  constructor(public chatService: ChatService) {}

  ngOnInit() {
    this.chatService.conversation.subscribe((val) => {
      this.messages = this.messages.concat(val);
    });
  }

  sendMessage() {
    if (this.value) {
      this.chatService.getBotAnswer(this.value);
      this.value = '';
    }
  }
}
