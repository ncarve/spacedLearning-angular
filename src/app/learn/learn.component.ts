import { Component, OnInit } from '@angular/core';
import { Question, EmptyQuestion } from '../question/question';
import { QuestionService } from '../question/question.service';
import * as R from 'ramda';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css']
})
export class LearnComponent implements OnInit {
  allQuestions: Question[];
  currentQuestion: Question = EmptyQuestion;
  currentAnswer: String = '';

  constructor(private questionService: QuestionService) { }

  ngOnInit() {
    this.questionService.getQuestions().subscribe(questions => {
      this.allQuestions = questions;
      this.pickRandomQuestion();
    });
  }

  pickRandomQuestion() {
    this.currentQuestion = this.allQuestions[Math.floor(Math.random()*this.allQuestions.length)];
    this.currentAnswer = '';
  }

  submitAnswer() {
    console.log(`Submitting ${this.currentAnswer} for ${this.currentQuestion.question}`);
    this.pickRandomQuestion();
  }
}
