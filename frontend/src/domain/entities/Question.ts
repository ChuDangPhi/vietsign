import { Base } from "./base";

export class QuestionModel extends Base {
  constructor() {
    super("teaching-management/questions");
  }

  getQuestions = async (query?: any) => {
    const res = await this.apiGet("", query);
    return res.data;
  };

  getQuestionById = async (id: number) => {
    const res = await this.apiGet(`/${id}`);
    return res.data;
  };

  createQuestion = async (data: any) => {
    const res = await this.apiPost("", data);
    return res.data;
  };

  updateQuestion = async (id: number, data: any) => {
    const res = await this.apiPut(`/${id}`, data);
    return res.data;
  };

  deleteQuestion = async (id: number) => {
    const res = await this.apiDelete(`/${id}`);
    return res.data;
  };

  getQuestionsByClassroom = async (classroomId: number) => {
    // Backend API expects ?class_room_id=...
    const res = await this.apiGet("", { class_room_id: classroomId });
    return res.data;
  };
}

const Questions = new QuestionModel();
export default Questions;
