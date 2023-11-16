import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  Renderer2,
} from '@angular/core';
import { OpenAiApiService } from '../openAI-chat.service';

@Component({
  selector: 'app-opne-ai-chatbot',
  templateUrl: './opne-ai-chatbot.component.html',
  styleUrls: ['./opne-ai-chatbot.component.scss'],
})
export class OpneAIChatbotComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  userMessage!: string;
  assistantReply!: string;
  chatMessages: { role: string; content: string }[] = [];
  isLoading: boolean = false;

  constructor(
    private openAiApiService: OpenAiApiService,
    private renderer: Renderer2
  ) {}

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.renderer.setProperty(
        this.chatContainer.nativeElement,
        'scrollTop',
        this.chatContainer.nativeElement.scrollHeight
      );
    } catch (err) {}
  }

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
      .sendMessage(this.chatMessages)
      .subscribe((response: any) => {
        this.assistantReply = response.reply;
        this.chatMessages.push({
          role: 'assistant',
          content: this.assistantReply,
        });
        this.userMessage = '';
      });
  }

  sendMessageStream() {
    if (
      this.userMessage === '' ||
      this.userMessage === null ||
      this.userMessage === undefined
    )
      return;
    const userMessage = this.userMessage;
    this.chatMessages.push({ role: 'user', content: userMessage });
    this.isLoading = true;
    let assistantMessagePushed = false;
    this.openAiApiService.getStreamedData(this.chatMessages).subscribe({
      next: (chunk) => {
        if (!assistantMessagePushed) {
          const assistantMessage = { role: 'assistant', content: '' };
          assistantMessage.content += chunk;
          this.chatMessages.push({ ...assistantMessage });
          assistantMessagePushed = true;
        } else {
          this.chatMessages[this.chatMessages.length - 1].content += chunk;
        }
      },
      error: (error) => {
        this.isLoading = false;
        window.alert(error);
      },
      complete: () => {
        this.userMessage = '';
        this.isLoading = false;
      },
    });
    this.userMessage = '';
  }

  stopStreaming() {
    this.openAiApiService.stopStreamedData().subscribe({
      next: (response) => {
        this.isLoading = false;
      },
      error: (error) => {
        window.alert(error);
      },
    });
  }
}
