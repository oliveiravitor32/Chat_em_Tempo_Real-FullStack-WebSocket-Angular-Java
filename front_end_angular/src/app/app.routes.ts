import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { ChatComponent } from './pages/chat/chat.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'chat', component: ChatComponent, canActivate: [authGuard] },
];
