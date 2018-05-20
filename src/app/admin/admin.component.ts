import { Component, OnInit } from '@angular/core';
import { EventEmitter } from "@angular/core";
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
  editingQuestion: Question;
  editingQuestionQ: string;
  editingQuestionA: string;
  questionFocus = new EventEmitter<boolean>();
  answerFocus = new EventEmitter<boolean>();

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

  startEdit(question: Question, type: string) {
    this.editingQuestionQ = question.question;
    this.editingQuestionA = question.answer;
    if (type == 'q') {
      question.editingQ = true;
    }
    else if (type == 'a') {
      question.editingA = true;
    }
    this.editingQuestion = question;
  }

  stopEdit(question: Question, type: string) {
    if (type == 'q')
      question.editingQ = false;
    else if (type == 'a')
      question.editingA = false;
    if (question.question == this.editingQuestionQ && question.answer == this.editingQuestionA)
      return;
    question.question = this.editingQuestionQ;
    question.answer = this.editingQuestionA;
    this.questionService.updateQuestion(question)
      .subscribe(() => {
        console.log(`Question ${question.id} updated`);
          this.editingQuestion = question;
        });
  }

  editQuestion(question: Question) {
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
