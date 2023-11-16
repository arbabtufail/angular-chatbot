import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { OpneAIChatbotComponent } from './opne-ai-chatbot/opne-ai-chatbot.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@NgModule({
  declarations: [AppComponent, ChatbotComponent, OpneAIChatbotComponent],
  imports: [
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // MatProgressSpinnerModule,
    // MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
