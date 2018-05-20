import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Question } from './question';
import * as uuid from 'uuid';
import {Buffer} from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private prodIp = '90.126.61.79';
  private apiUrl = 'http://localhost:16716/api';

  private username: string;
  private password: string;
  private basicAuthHeader: string;
  private onSetCredentials: ((success: boolean) => void);

  constructor(private http: HttpClient) { }

  login() {
    return this.http.get<Question[]>(`${this.apiUrl}/users/login`);
  }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/questions/`);
  }

  addQuestion(question: string, answer: string): Observable<Question> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
  
    return this.http.post<Question>(`${this.apiUrl}/questions/`, {question, answer}, httpOptions);
  }

  deleteQuestion({id}: Question): Observable<HttpResponse<string>> {
    return this.http.delete(`${this.apiUrl}/questions/${id}`, {observe: 'response', responseType: 'text'});
  }

  saveCredentials(username, password) {
    this.username = username;
    this.password = password;
    this.basicAuthHeader = Buffer.from(`${this.username}:${this.password}`, 'utf8').toString('base64');
    console.log("Credentials saved!");
    this.login().subscribe(res => {
      console.log(`Successful login!`);
      this.onSetCredentials(true);
    }, (err: HttpErrorResponse) => {
      console.log(`Failed login`);
    });
  }

  setCredentialsCallback(callback: ((username: string, password: string, success: boolean) => void)) {
    this.onSetCredentials = (success: boolean) => callback(this.username, this.password, success);
  }

  resetCredentials() {
    console.log("Credentials reset");
    this.password = '';
    this.basicAuthHeader = '';
    this.onSetCredentials(false);
  }

  getBasicAuthHeader() {
    return this.basicAuthHeader;
  }
}
