import { Injectable } from '@angular/core';

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { MessageTypeEnum } from '../enums/message-type.enum';
import { IChatMessage } from '../interfaces/chat-message.interface';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  // Instância da conexão WebSocket
  socketClient: any = null;

  constructor() {}

  // Cria conexão com o servidor WebSocket
  connect(username: String) {
    let ws = new SockJS('http://localhost:8080/ws');
    this.socketClient = Stomp.over(ws);

    this.socketClient.connect(
      {},
      this.onConnect.bind(this, username),
      this.onError.bind(this)
    );
  }

  // Tratamento para caso de sucesso na conexão com o servidor
  onConnect(username: String): any {
    // Se inscrevendo em tópico publico
    this.socketClient.subscribe('/topic/public', this.onMessageReceived);

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
    const message = JSON.parse(payload.body);
    console.log(message);

    if (message.type === MessageTypeEnum.JOIN) {
      console.log(message.sender + ' entrou.');
    } else if (message.type === MessageTypeEnum.LEAVE) {
      console.log(message.sender + ' saiu.');
    } else {
      console.log('Chat message: ' + message.content);
    }
  }
}
