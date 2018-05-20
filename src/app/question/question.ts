export class Question {
  id: string;
  status: string;
  question: string;
  answer: string;
  nb_correct: number;
  nb_wrong: number;
  editingQ: boolean = false;
  editingA: boolean = false;

  get weight(): number {
    if (this.nb_correct + this.nb_wrong == 0)
      return 0.2;
    return (5 + this.nb_wrong)/(5 + this.nb_correct + this.nb_wrong);
  }

  constructor(id:string, status:string, question: string, answer: string, nb_correct?: number, nb_wrong?: number) {
    this.id = id;
    this.status = status;
    this.question = question;
    this.answer = answer;
    this.nb_correct = nb_correct || 0;
    this.nb_wrong = nb_wrong || 0;
  }
};

export const EmptyQuestion: Question = new Question('', '', '', '');
