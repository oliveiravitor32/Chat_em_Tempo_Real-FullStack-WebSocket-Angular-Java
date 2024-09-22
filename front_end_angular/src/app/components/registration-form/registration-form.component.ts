import { Component, output } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
  onSubmitForm = output<string>();

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
    this.onSubmitForm.emit(this.username.value);
  }
}
