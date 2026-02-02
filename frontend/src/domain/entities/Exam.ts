import { Base } from "./base";

export class ExamModel extends Base {
  constructor() {
    super("teaching-management/exams");
  }

  getAllExams = async (query?: any) => {
    const res = await this.apiGet("", query);
    return res.data;
  };

  getExamById = async (id: number) => {
    const res = await this.apiGet(`/${id}`);
    return res.data;
  };

  createExam = async (data: any) => {
    const res = await this.apiPost("", data);
    return res.data;
  };

  updateExam = async (id: number, data: any) => {
    const res = await this.apiPut(`/${id}`, data);
    return res.data;
  };

  deleteExam = async (id: number) => {
    const res = await this.apiDelete(`/${id}`);
    return res.data;
  };

  submitExam = async (id: number, answers: any) => {
    const res = await this.apiPost(`/${id}/submit`, answers);
    return res.data;
  };

  getExamsByClassroom = async (classroomId: number) => {
    const res = await this.apiGet(`/classroom/${classroomId}`);
    return res.data;
  };
}

const Exams = new ExamModel();
export default Exams;
