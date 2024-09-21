import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './registration-form.component.html',
  styleUrl: './registration-form.component.scss',
})
export class RegistrationFormComponent {
  socketClient: any = null;

  username: FormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
  ]);

  onSubmit(event: Event) {
    event.preventDefault();

    const IS_USERNAME_VALID = this.username.valid;
    if (!IS_USERNAME_VALID) {
      return;
    }

    let ws = new SockJS('http://localhost:8080/ws');
    this.socketClient = Stomp.over(ws);

    this.socketClient.connect(
      {},
      this.onConnect.bind(this),
      this.onError.bind(this)
    );
  }

  onConnect(): any {
    // Se inscrevendo em tópico publico
    this.socketClient.subscribe('/topic/public', onMessageReceived);

    // Avisar servidor da conexão de um novo usuário
    this.socketClient.send(
      '/app/chat.addUser',
      {},
      JSON.stringify({
        sender: this.username.value,
        content: '',
        type: 'JOIN',
      })
    );
  }

  onError(): any {
    alert(
      'Falha ao conectar com o servidor WebSocket. Por favor recarregue a página e tente novamente!'
    );
  }

  sendMessage() {
    const message = 'default message';

    if (message && this.socketClient) {
      const chatMessage = {
        sender: this.username.value,
        content: message,
        type: 'CHAT',
      };

      this.socketClient.send(
        '/app/chat.sendMessage',
        {},
        JSON.stringify(chatMessage)
      );

      // clear input after
    }
  }
}

function onMessageReceived(payload: any): any {
  const message = JSON.parse(payload.body);
  console.log(message);

  if (message.type === 'JOIN') {
    console.log(message.sender + ' entrou.');
  } else if (message.type === 'LEAVE') {
    console.log(message.sender + ' saiu.');
  } else {
    console.log('Chat message: ' + message.content);
  }
}
