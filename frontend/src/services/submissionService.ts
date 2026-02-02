import { Base } from "@/domain/entities/base";
import { mockSubmissions, SubmissionItem } from "@/data";

class SubmissionModelClass extends Base {
  constructor() {
    super("submissions");
  }

  getAllSubmissions = async (): Promise<any> => {
    // Mock implementation
    return mockSubmissions;
  };
}

const SubmissionModel = new SubmissionModelClass();

export async function fetchAllSubmissions(): Promise<SubmissionItem[]> {
  return mockSubmissions;
}
