import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root',
})
export class OpenAiApiServiceService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  public sendMessage(message: string) {
    return this.http.post<any>(`${this.apiUrl}/chat`, { message });
  }
}
