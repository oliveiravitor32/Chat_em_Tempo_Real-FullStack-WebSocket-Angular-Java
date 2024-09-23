import {
  Directive,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MessageTypeEnum } from '../enums/message-type.enum';
import { IChatMessage } from '../interfaces/chat-message.interface';

@Directive({
  selector: '[appUserMessageStyle]',
  standalone: true,
})
export class UserMessageStyleDirective implements OnChanges {
  @Input({ required: true }) message!: IChatMessage;
  @Input({ required: true }) username!: string;

  @HostBinding('class') hostClasses = '';

  ngOnChanges(changes: SimpleChanges) {
    if (changes['message'] && changes['username']) {
      this.setClasses();
    }
  }

  private setClasses() {
    const classes = [];

    const IS_SELF_MESSAGE = this.message.sender === this.username;

    const IS_JOIN_MESSAGE = this.message.type === MessageTypeEnum.JOIN;

    const IS_LEAVE_MESSAGE = this.message.type === MessageTypeEnum.LEAVE;

    console.log('my user:', this.username);
    console.log('self message:', this.message.sender);
    console.log('type message:', this.message.type);

    // Classe de estilo para mensagem própria
    if (IS_SELF_MESSAGE) {
      classes.push(
        'message-box--bg-color--green',
        'chat__message-box--bg-color--green'
      );
    } else {
      // Classe de estilo para mensagem de outro usuário
      classes.push('message-box--bg-color--dark-gray');
    }

    // Classe de estilo para mensagem do tipo "JOIN" (entrou)
    if (IS_JOIN_MESSAGE) {
      classes.push('message-box--message-type--join');
    }

    // Classe de estilo para mensagem do tipo "LEAVE" (saiu)
    if (IS_LEAVE_MESSAGE) {
      classes.push('message-box--message-type--leave');
    }

    // Define as classes no host
    this.hostClasses = classes.join(' ');
  }
}
