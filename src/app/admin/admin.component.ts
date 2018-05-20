import { Component, OnInit } from '@angular/core';
import { Question } from '../question/question';
import { QuestionService } from '../question/question.service';
import { HttpResponse } from '@angular/common/http';
import * as R from 'ramda';

@Component({
  selector: 'app-questions',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  questions: Question[];
  toAddQuestion: string;
  toAddAnswer: string;

  constructor(private questionService: QuestionService) { }
  
  ngOnInit() {
    this.questionService.getQuestions().subscribe(questions => {
      this.questions = questions.map(({id, status, question, answer}) => new Question(id, status, question, answer));
    });
  }

  addQuestion() {
    console.log(this.toAddQuestion, this.toAddAnswer);
    this.questionService.addQuestion(this.toAddQuestion, this.toAddAnswer).subscribe(question => {
      this.questions.push(question);
      this.toAddAnswer = '';
      this.toAddQuestion = '';
      });
  }

  deleteQuestion(q: Question) {
    this.questionService.deleteQuestion(q)
      .subscribe((res: HttpResponse<string>) => {
        console.log(`Delete question '${q.question}' => ${res.status}`);
        if (res.status == 204)
          this.questions = R.reject(R.pipe(R.prop('id'), R.equals(q.id)), this.questions);
      },
      (err: HttpResponse<string>) => {
        console.log(`Delete question '${q.question}' => ${err.status}`);
      }
    );
  }
}
