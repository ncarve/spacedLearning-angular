import { Component, OnInit } from '@angular/core';
import { QuestionService } from './question/question.service';
import { Question } from './question/question';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Spaced Learning';
}
