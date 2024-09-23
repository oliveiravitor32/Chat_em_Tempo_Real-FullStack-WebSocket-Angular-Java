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
import { UserService } from '../../services/user.service';
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

  user: string = '';

  typedMessage: FormControl = new FormControl('', [Validators.required]);

  constructor(
    private readonly websocketService: WebsocketService,
    private readonly userService: UserService
  ) {}

  ngOnInit(): void {
    // Obtendo usuário nome de usuário
    this.user = this.userService.getUser();

    // Cria subscrição para mensagens recebidas do servidor
    const subscription = this.websocketService
      .getReceivedMessages()
      .subscribe((message) => this.messages.push(message));

    // Adiciona a subscrição para a variável
    this.receivedMessagesSubscription.add(subscription);
  }

  // Método para evitar a quebra de linha com a tecla Enter sozinha
  onKeyDown(event: KeyboardEvent) {
    // Verifica se foi precionada a tecla Enter e não combinada com a tecla Shift
    // Com Shift + Enter o evento de quebra de linha ocorre normalmente
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.onSendMessage();
    }
  }

  // Enviar mensagem
  onSendMessage(event?: SubmitEvent) {
    // Evita recarregamento da página, se for acionada pelo botão de submit
    // Event pode não exister se o método for chamado manualmento pelo onKeyDown()
    event?.preventDefault();

    const message: IChatMessage = {
      sender: this.user,
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
