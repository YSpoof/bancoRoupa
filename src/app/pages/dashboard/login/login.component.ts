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
  imports: [ReactiveFormsModule, RouterModule],
  template: ` @if (userSvc.currentUserSig() === null) {
    <div class="flex flex-col items-center justify-center h-full">
      <p class="text-2xl font-bold mb-4">Acesse a VestBank!</p>

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
          class="transition-all cursor-pointer bg-green-700 hover:bg-green-800 active:scale-95 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
        <a
          routerLink="/dashboard/register"
          class="text-blue-500 hover:text-blue-700"
          >Não sou cliente</a
        >
        <a
          routerLink="/dashboard/reset"
          class="text-yellow-500 hover:text-yellow-700"
          >Esqueci a senha</a
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
      Validators.minLength(1),
    ]),
  });

  login() {
    if (!this.loginForm.valid) {
      if (this.loginForm.get('email')?.errors?.['required']) {
        this.toast.showError('Preencha o campo email.');
      }
      if (this.loginForm.get('email')?.errors?.['email']) {
        this.toast.showError('Email informado é inválido');
      }
      if (this.loginForm.get('password')?.errors?.['required']) {
        this.toast.showError('Preencha o campo senha.');
      }
      if (this.loginForm.get('password')?.errors?.['minlength']) {
        this.toast.showError('Senha deve ter no mínimo 6 caracteres');
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
