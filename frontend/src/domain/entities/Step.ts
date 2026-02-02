import { Base } from "./base";

export interface Step {
  id: number;
  title: string;
  type: string;
}

class StepModelClass extends Base {
  constructor() {
    super("steps");
  }
}

const StepModel = new StepModelClass();
export default StepModel;
