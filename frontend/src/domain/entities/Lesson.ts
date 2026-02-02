import { Base } from "./base";

export class LessonModel extends Base {
  constructor() {
    super("lessons");
  }

  getAllLessons = async (query?: any) => {
    const res = await this.apiGet("", query);
    return res.data;
  };

  getLessonById = async (id: number) => {
    const res = await this.apiGet(`/${id}`);
    return res.data;
  };

  createLesson = async (data: any) => {
    const res = await this.apiPost("", data);
    return res.data;
  };

  updateLesson = async (id: number, data: any) => {
    const res = await this.apiPut(`/${id}`, data);
    return res.data;
  };

  deleteLesson = async (id: number) => {
    const res = await this.apiDelete(`/${id}`);
    return res.data;
  };
}

const Lessons = new LessonModel();
export default Lessons;
