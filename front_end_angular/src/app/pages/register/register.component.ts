import { Component } from '@angular/core';
import { RegistrationFormComponent } from '../../components/registration-form/registration-form.component';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RegistrationFormComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(private readonly websocketService: WebsocketService) {}

  onSubmitForm(username: string) {
    this.websocketService.connect(username);
  }
}
