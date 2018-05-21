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
    if(this.questionService.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.questionService.token}`
        }
      });
    }
    else if(this.questionService.basicAuthHeader) {
      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${this.questionService.basicAuthHeader}`
        }
      });
    }
    
    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        },
        error => {
          if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
              console.log("401 intercepted");
              this.questionService.logout();
            }
          }
        }
      ));
  }
}
