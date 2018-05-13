import { Component, OnInit } from '@angular/core';
import { QuestionsService } from './questions/questions.service';
import { Question } from './questions/question';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Spaced Learning';
}
