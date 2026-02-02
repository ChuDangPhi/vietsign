import { Base } from "./base";

export class TopicModel extends Base {
  constructor() {
    super("teaching-management/topics");
  }

  getTopics = async (query?: any) => {
    const res = await this.apiGet("", query);
    return res.data;
  };

  getTopicsByClassroom = async (classroomId: number) => {
    const res = await this.apiGet(`/classroom/${classroomId}`);
    return res.data;
  };

  getTopicById = async (id: number) => {
    const res = await this.apiGet(`/${id}`);
    return res.data;
  };
}

const Topics = new TopicModel();
export default Topics;
