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

  getDetailPracticeExam = async (examId: number) => {
    // Assuming backend route /practice/:id exists or will exist
    const res = await this.apiGet(`/practice/${examId}`);
    return res.data;
  };

  submitPracticeVideos = async (body: FormData) => {
    // Assuming backend route /practice/submit exists or will exist
    const res = await this.apiUploadFile(`/practice/submit`, body);
    return res.data;
  };

  getPracticeExamSubmission = async (examId: number, studentId: number) => {
    // Backend route placeholder
    const res = await this.apiGet(
      `/practice-submission/${examId}/${studentId}`,
    );
    return res.data;
  };

  markPracticeExam = async (data: any) => {
    // Backend route placeholder
    const res = await this.apiPost(`/mark-practice`, data);
    return res.data;
  };
}

const Exams = new ExamModel();
export default Exams;
