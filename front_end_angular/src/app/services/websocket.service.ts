import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { MessageTypeEnum } from '../enums/message-type.enum';
import { IChatMessage } from '../interfaces/chat-message.interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  // Instância da conexão WebSocket
  private socketClient: any = null;

  // Observer para mensagens recebidas
  private receivedMessages$ = new Subject<IChatMessage>();

  constructor(
    private readonly router: Router,
    private readonly userService: UserService
  ) {}

  // Cria conexão com o servidor WebSocket
  connect(username: string) {
    let ws = new SockJS('http://localhost:8080/ws');
    this.socketClient = Stomp.over(ws);

    this.socketClient.connect(
      {},
      this.onConnect.bind(this, username),
      this.onError.bind(this)
    );
  }

  // Tratamento para caso de sucesso na conexão com o servidor
  onConnect(username: string): any {
    // Define usuário
    this.userService.setUser(username);

    // Se inscrevendo em tópico publico
    this.socketClient.subscribe(
      '/topic/public',
      this.onMessageReceived.bind(this)
    );

    // Avisar servidor da conexão de um novo usuário
    this.socketClient.send(
      '/app/chat.addUser',
      {},
      JSON.stringify({
        sender: username,
        content: '',
        type: MessageTypeEnum.JOIN,
      })
    );

    // Alterar a rota para página de chat
    this.router.navigate(['/chat']);
  }

  // Aviso de erro para o usuário em caso de falha em se conectar com o servidor
  onError(): any {
    alert(
      'Falha na conexão com o servidor WebSocket. Por favor recarregue a página e tente novamente!'
    );
  }

  // Envia mensagem para o servidor
  sendMessage(chatMessage: IChatMessage) {
    chatMessage.type = MessageTypeEnum.CHAT;

    if (chatMessage.sender && chatMessage.content && this.socketClient) {
      this.socketClient.send(
        '/app/chat.sendMessage',
        {},
        JSON.stringify(chatMessage)
      );
    }
  }

  // Tratamento para mensagens recebidas do servidor
  onMessageReceived(payload: any): any {
    let message: IChatMessage = JSON.parse(payload.body);

    this.receivedMessages$.next(message);
  }

  getReceivedMessages(): Observable<any> {
    return this.receivedMessages$.asObservable();
  }
}
