import { Component, OnDestroy, OnInit } from '@angular/core';

import { AsyncPipe, NgClass } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserMessageStyleDirective } from '../../directives/user-message-style.directive';
import { MessageTypeEnum } from '../../enums/message-type.enum';
import { IChatMessage } from '../../interfaces/chat-message.interface';
import { WebsocketService } from '../../services/websocket.service';
import { ChatMessagesList } from '../../types/chat-messages-list';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgClass,
    UserMessageStyleDirective,
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, OnDestroy {
  messages: ChatMessagesList = [];

  receivedMessagesSubscription = new Subscription();

  username: string = 'BOB';

  typedMessage: FormControl = new FormControl('', [Validators.required]);

  constructor(private readonly websocketService: WebsocketService) {}

  ngOnInit(): void {
    // Obtendo nome de usuário
    this.username = this.websocketService.getUsername();

    // Cria subscrição para mensagens recebidas do servidor
    const subscription = this.websocketService
      .getReceivedMessages()
      .subscribe((message) => this.messages.push(message));

    // Adiciona a subscrição para a variável
    this.receivedMessagesSubscription.add(subscription);
  }

  onSendMessage(event: SubmitEvent) {
    // Evita recarregamento da página
    event.preventDefault();

    const message: IChatMessage = {
      sender: this.username,
      content: this.typedMessage.value,
      type: MessageTypeEnum.CHAT,
    };

    // Envia mensagem para o serviço
    this.websocketService.sendMessage(message);

    // Limpa campo de texto
    this.typedMessage.reset();
  }

  ngOnDestroy(): void {
    // Destroi subscrição
    this.receivedMessagesSubscription.unsubscribe();
  }
}
