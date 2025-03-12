import { afterNextRender, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../../services/toast.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  template: ` @if (userSvc.currentUserSig() === null) {
    <div class="flex flex-col items-center justify-center h-full">
      <p class="text-2xl font-bold mb-4">Olá, faça o login</p>

      <form [formGroup]="loginForm" class="flex flex-col gap-2 w-80">
        <input
          formControlName="email"
          type="email"
          class="border rounded p-2"
          placeholder="Email"
        />
        <input
          formControlName="password"
          type="password"
          class="border rounded p-2"
          placeholder="Password"
        />
        <button
          (click)="login()"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
        <a
          routerLink="/dashboard/register"
          class="text-blue-500 hover:text-blue-700"
          >Não possui uma conta? Crie uma aqui.</a
        >
      </form>
    </div>
    }`,
})
export class LoginPageComponent {
  userSvc = inject(UserService);
  formBuilder = inject(FormBuilder);
  toast = inject(ToastService);
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  login() {
    if (!this.loginForm.valid) {
      if (this.loginForm.get('email')?.errors?.['required']) {
        this.toast.showToast('Preencha o campo email.', 'Erro', 'error');
      }
      if (this.loginForm.get('email')?.errors?.['email']) {
        this.toast.showToast('Email informado é inválido', 'Erro', 'error');
      }
      if (this.loginForm.get('password')?.errors?.['required']) {
        this.toast.showToast('Preencha o campo senha.', 'Erro', 'error');
      }
      if (this.loginForm.get('password')?.errors?.['minlength']) {
        this.toast.showToast(
          'Senha deve ter no mínimo 6 caracteres',
          'Erro',
          'error'
        );
      }
      return;
    }
    const { email, password } = this.loginForm.getRawValue();
    this.userSvc.login(email!, password!);
  }

  constructor() {
    afterNextRender(() => {
      this.userSvc.login(null, null, true);
    });
  }
}
