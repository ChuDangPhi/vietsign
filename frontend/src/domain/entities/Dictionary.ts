import { Base } from "./base";

export class DictionaryModel extends Base {
  constructor() {
    super("teaching-management/vocabularies");
  }

  getAllWords = async (query?: any) => {
    const res = await this.apiGet("", query);
    return res.data;
  };

  getWordById = async (id: number) => {
    const res = await this.apiGet(`/${id}`);
    return res.data;
  };

  searchWords = async (keyword: string) => {
    const res = await this.apiGet("/search", { content: keyword });
    return res.data;
  };

  createWord = async (data: any) => {
    const res = await this.apiPost("", data);
    return res.data;
  };

  createMultipleWords = async (data: any[]) => {
    const res = await this.apiPost("/list", data);
    return res.data;
  };

  updateWord = async (id: number, data: any) => {
    const res = await this.apiPut(`/${id}`, data);
    return res.data;
  };

  deleteWord = async (id: number) => {
    const res = await this.apiDelete(`/${id}`);
    return res.data;
  };

  getByTopic = async (topicId: number) => {
    const res = await this.apiGet(`/topic/${topicId}`);
    return res.data;
  };
}

const Dictionary = new DictionaryModel();
export default Dictionary;
