import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http'
import { Question, EmptyQuestion } from '../question/question';
import { QuestionService } from '../question/question.service';
import * as R from 'ramda';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css']
})
export class LearnComponent implements OnInit {
  allQuestions: Map<string, Question> = new Map<string, Question>();
  currentQuestion: Question = EmptyQuestion;
  currentAnswer: String = '';

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    this.questionService.getQuestions().subscribe(questions => {
      questions.forEach(question => {
        this.allQuestions.set(question.id, new Question(question.id, question.status, question.question, question.answer));
      });
      if (!this.questionService.loggedIn)
        return this.pickRandomQuestion();
       
      this.questionService.getUserQuestions().subscribe(userQuestions => {
        userQuestions.forEach((question) => {
          const q: Question = this.allQuestions.get(question.id)
          q.nb_correct = question.nb_correct;
          q.nb_wrong = question.nb_wrong;
        });
        return this.pickRandomQuestion();
      });
    });
  }

  pickRandomQuestion() {
    let bestQuestions: Question[] = [];
    let bestQuestionWeight = 0;

    this.allQuestions.forEach((question: Question, id: string) => {
      console.log(`${question.question}: ${question.weight}`);
      const w = question.weight;
      if (w == bestQuestionWeight)
        bestQuestions.push(question);
      else if (w > bestQuestionWeight)
      {
        bestQuestions = [question];
        bestQuestionWeight = w;
      }
    });

    this.currentQuestion = bestQuestions[Math.floor(Math.random()*bestQuestions.length)];
    this.currentAnswer = '';
  }

  submitAnswer() {
    console.log(`Submitting ${this.currentAnswer} for ${this.currentQuestion.question}`);
    const correct = (this.currentAnswer == this.currentQuestion.answer);
    this.questionService.submitAnswer(this.currentQuestion, correct).subscribe(
      (res: HttpResponse<string>) => {
        console.log(`submitAnswer '${this.currentQuestion}' => ${res.status}`);
        if (res.status == 204)
          this.pickRandomQuestion();
      },
      (err: HttpResponse<string>) => {
        console.log(`submitAnswer '${this.currentQuestion}' => ${err.status}`);
      }
    );
  }
}
