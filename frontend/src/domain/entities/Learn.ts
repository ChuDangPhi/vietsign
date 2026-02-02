import { Base } from "./base";

export interface Learn {
  id: number;
  title: string;
}

// Minimal model for now
class LearnModelClass extends Base {
  constructor() {
    super("learn");
  }
}

const LearnModel = new LearnModelClass();
export default LearnModel;
