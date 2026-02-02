import { Base } from "./base";

export interface SelfLearn {
  id: number;
  title: string;
}

class SelfLearnModelClass extends Base {
  constructor() {
    super("self-learn");
  }
}

const SelfLearnModel = new SelfLearnModelClass();
export default SelfLearnModel;
