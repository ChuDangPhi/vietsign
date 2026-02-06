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

  getLessonsByClassroom = async (classroomId: number) => {
    const res = await this.apiGet("", { classroom_id: classroomId });
    return res.data;
  };

  getLessonsByTopic = async (topicId: number) => {
    const res = await this.apiGet("", { topic_id: topicId });
    return res.data;
  };

  /* 
  // Backend endpoints not yet implemented
  getLessonStatistics = async (query: {
    classroom_id: number;
    topic_id?: number;
  }) => {
    const res = await this.apiGet("/statistics", query);
    return res.data;
  };

  reorderLessons = async (
    topicId: number,
    lessons: { lesson_id: number; order_number: number }[],
  ) => {
    const res = await this.apiPut(`/topic/${topicId}/reorder`, { lessons });
    return res.data;
  };
  */

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

  deleteLessonsByTopic = async (topicId: number) => {
    const res = await this.apiDelete(`/topic/${topicId}`);
    return res.data;
  };
}

const Lessons = new LessonModel();
export default Lessons;
