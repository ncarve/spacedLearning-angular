export class Question {
  id: string;
  status: string;
  question: string;
  answer: string;

  constructor(id:string, status:string, question: string, answer: string) {
    this.id = id;
    this.status = status;
    this.question = question;
    this.answer = answer;
  }
};

export const EmptyQuestion: Question = new Question('', '', '', '');
