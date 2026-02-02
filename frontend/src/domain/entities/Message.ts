import { Base } from "./base";

export interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  createdAt: string;
}

class MessageModelClass extends Base {
  constructor() {
    super("messages");
  }
}

const MessageModel = new MessageModelClass();
export default MessageModel;
