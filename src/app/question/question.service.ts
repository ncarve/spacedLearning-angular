import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Question } from './question';
import * as uuid from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private prodIp = '90.126.61.79';
  private questionsUrl = 'http://localhost:16716/api/questions/';

  constructor(private http: HttpClient) { }

  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.questionsUrl);
  }

  addQuestion(question: string, answer: string): Observable<Question> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };
  
    return this.http.post<Question>(this.questionsUrl, {question, answer}, httpOptions);
  }

  deleteQuestion({id}: Question) {
    this.http.delete(`${this.questionsUrl}${id}`).subscribe();
  }
}
