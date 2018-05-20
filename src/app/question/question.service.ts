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
  token: string;
  private onSetCredentials: ((success: boolean) => void);

  loggedIn: boolean = false;
  get basicAuthHeader(): string {
    if (this.username && this.password)
      return Buffer.from(`${this.username}:${this.password}`, 'utf8').toString('base64');
    return null;
  }

  constructor(private http: HttpClient) {
    if(localStorage.getItem('token'))
      this.token = localStorage.getItem('token');
    if(localStorage.getItem('username'))
      this.username = localStorage.getItem('username');
  }

  login(): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, {});
  }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/questions/`);
  }

  getUserQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/user/questions/`);
  }

  addQuestion(question: string, answer: string): Observable<Question> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
  
    return this.http.post<Question>(`${this.apiUrl}/questions/`, {question, answer}, httpOptions);
  }

  updateQuestion({id, question, answer}: Question): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/questions/${id}`, {question, answer});
  }

  deleteQuestion({id}: Question): Observable<HttpResponse<string>> {
    return this.http.delete(`${this.apiUrl}/questions/${id}`, {observe: 'response', responseType: 'text'});
  }

  submitAnswer(question: Question, correct: boolean): Observable<HttpResponse<string>> {
    return this.http.post(`${this.apiUrl}/questions/${question.id}/submit`, {correct}, {observe: 'response', responseType: 'text'});
  }

  logout() {
    localStorage.removeItem('token');
    this.onSetCredentials(false);
  }

  saveCredentials(username: string, password: string): void {
    if(!username || !password)
      return;
    this.username = username;
    this.password = password;
    localStorage.setItem('username', username);
    //localStorage.setItem('password', password);
    console.log("Credentials saved!");
    this.login().subscribe(res => {
      console.log(`Successful login!`);
      this.token = res.token;
      localStorage.setItem('token', this.token);
      this.onSetCredentials(true);
    }, (err: HttpErrorResponse) => {
      console.log(`Failed login`);
    });
  }

  setCredentialsCallback(callback: ((username: string, password: string, success: boolean) => void)) {
    this.onSetCredentials = (success: boolean) => {
      this.loggedIn = success;
      return callback(this.username, this.password, success);
    }
    this.onSetCredentials(this.token !== undefined);
  }

  resetCredentials() {
    console.log("Credentials reset");
    this.password = '';
    this.token = '';
    this.onSetCredentials(false);
  }
}
