import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError } from "rxjs/operators";
import { LoginComponent } from '../login/login.component'
import { QuestionService } from '../question/question.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  constructor(private questionService: QuestionService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        Authorization: `Basic ${this.questionService.getBasicAuthHeader()}`
      }
    });
    
    return next.handle(request);
  }
}
