import { Component } from '@angular/core';
import { OpenAiApiService } from '../openAI-chat.service';

@Component({
  selector: 'app-opne-ai-chatbot',
  templateUrl: './opne-ai-chatbot.component.html',
  styleUrls: ['./opne-ai-chatbot.component.scss'],
})
export class OpneAIChatbotComponent {
  userMessage!: string;
  assistantReply!: string;
  chatMessages: { role: string; content: string }[] = [];
  constructor(private openAiApiService: OpenAiApiService) {}

  sendMessage() {
    if (
      this.userMessage === '' ||
      this.userMessage === null ||
      this.userMessage === undefined
    )
      return;

    const userMessage = this.userMessage;
    this.chatMessages.push({ role: 'user', content: userMessage });
    this.openAiApiService
      .sendMessage(this.userMessage)
      .subscribe((response: any) => {
        this.assistantReply = response.reply;
        this.chatMessages.push({
          role: 'assistant',
          content: this.assistantReply,
        });
        this.userMessage = '';
      });
  }
}
