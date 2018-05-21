import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question/question.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  loggedIn: boolean = true;

  constructor(private questionService: QuestionService) {
    this.questionService.setCredentialsCallback(this.setCredentials);
  }

  saveCredentials() {
    this.questionService.saveCredentials(this.username, this.password);
    this.password = '';
  }

  setCredentials = (username: string, password: string, success = false) => {
    this.username = username;
    //this.password = password;
    this.loggedIn = success;
  };

  logout(): void {
    this.questionService.logout();
  }

  ngOnInit() {
  }
}
