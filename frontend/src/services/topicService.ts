import Topics from "@/domain/entities/Topic";
import Dictionary from "@/domain/entities/Dictionary";

export interface TopicItem {
  id: number;
  name: string;
  classroomId?: number;
}

export async function fetchAllTopics(query: any = {}): Promise<TopicItem[]> {
  try {
    const response = await Topics.getTopics({ limit: 1000, ...query });
    const data = response.data || response;
    // Check if data is array or object with data property
    const items = Array.isArray(data) ? data : data.data || [];

    return Array.isArray(items)
      ? items.map((t: any) => ({
          id: t.topic_id || t.id,
          name: t.name || t.content,
          classroomId: t.classroom_id,
        }))
      : [];
  } catch (error) {
    console.error("Error fetching topics:", error);
    return [];
  }
}

export async function fetchTopicsByClassroom(
  classroomId: number,
): Promise<TopicItem[]> {
  try {
    const response = await Topics.getTopicsByClassroom(classroomId);
    const data = response.data || response;
    const items = Array.isArray(data) ? data : data.data || [];

    return Array.isArray(items)
      ? items.map((t: any) => ({
          id: t.topic_id || t.id,
          name: t.name || t.content,
          classroomId: t.classroom_id,
        }))
      : [];
  } catch (error) {
    console.error("Error fetching topics by classroom:", error);
    return [];
  }
}

export async function fetchVocabulariesByTopic(
  topicId: number,
): Promise<any[]> {
  try {
    const response = await Dictionary.getAllWords({ topic_id: topicId });
    const data = response.data || response;
    const items = Array.isArray(data) ? data : data.data || [];

    return Array.isArray(items)
      ? items.map((v: any) => ({
          id: v.vocabulary_id || v.id,
          word: v.word || v.content,
          images_path: v.images_path,
          videos_path: v.videos_path,
        }))
      : [];
  } catch (error) {
    console.error("Error fetching vocabularies by topic:", error);
    return [];
  }
}

export async function createTopic(data: any): Promise<any> {
  try {
    const response = await Topics.createTopic(data);
    return response.data || response;
  } catch (error) {
    console.error("Error creating topic:", error);
    throw error;
  }
}

export async function updateTopic(id: number, data: any): Promise<any> {
  try {
    const response = await Topics.updateTopic(id, data);
    return response.data || response;
  } catch (error) {
    console.error(`Error updating topic ${id}:`, error);
    throw error;
  }
}

export async function deleteTopic(id: number): Promise<any> {
  try {
    const response = await Topics.deleteTopic(id);
    return response.data || response;
  } catch (error) {
    console.error(`Error deleting topic ${id}:`, error);
    throw error;
  }
}
