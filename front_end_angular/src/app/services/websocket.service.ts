import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { MessageTypeEnum } from '../enums/message-type.enum';
import { IChatMessage } from '../interfaces/chat-message.interface';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  // Instância da conexão WebSocket
  private socketClient: any = null;

  // Observer para mensagens recebidas
  private receivedMessages$ = new Subject<IChatMessage>();

  private username: string = '';

  constructor(private readonly router: Router) {}

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
    this.username = username;

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
      'Falha ao conectar com o servidor WebSocket. Por favor recarregue a página e tente novamente!'
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

    //console.log('console log message: ', message);

    // Cria mensagem padrão para teste caso não receba uma mensagem completa
    // if (true) {
    //   message = {
    //     sender: 'BOB',
    //     content: 'HEELLO',
    //     type: MessageTypeEnum.CHAT,
    //   };
    // }

    this.receivedMessages$.next(message);
  }

  getReceivedMessages(): Observable<any> {
    return this.receivedMessages$.asObservable();
  }

  getUsername(): string {
    return this.username;
  }
}
