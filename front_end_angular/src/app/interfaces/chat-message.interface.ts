import { MessageTypeEnum } from '../enums/message-type.enum';

export interface IChatMessage {
  sender: string;
  content: string;
  type: MessageTypeEnum;
}
