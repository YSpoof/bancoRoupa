import { Component, inject } from '@angular/core';
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
      <p class="text-2xl font-bold mb-4">Abra a sua em menos em segundos!</p>

      <form [formGroup]="registerForm" class="flex flex-col gap-2 w-80">
        <input
          formControlName="name"
          type="text"
          class="border rounded p-2"
          placeholder="Nome"
          required="true"
        />
        <input
          formControlName="email"
          type="email"
          class="border rounded p-2"
          placeholder="Email"
          required="true"
        />
        <input
          formControlName="password"
          type="password"
          class="border rounded p-2"
          placeholder="Password"
          required="true"
        />
        <button
          (click)="register()"
          class="transition-all cursor-pointer bg-blue-500 hover:bg-blue-700 active:scale-95 text-white font-bold py-2 px-4 rounded"
        >
          Criar conta
        </button>
        <a
          routerLink="/dashboard/login"
          class="text-blue-500 hover:text-blue-700"
          >Já tem uma conta? Faça login.</a
        >
      </form>
    </div>
    }`,
})
export class RegisterPageComponent {
  userSvc = inject(UserService);
  formBuilder = inject(FormBuilder);
  toast = inject(ToastService);
  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  register() {
    if (!this.registerForm.valid) {
      if (this.registerForm.get('name')?.errors?.['required']) {
        this.toast.showError('Preencha o campo nome.');
      }
      if (this.registerForm.get('name')?.errors?.['minlength']) {
        this.toast.showError('Nome deve ter no mínimo 3 caracteres');
      }
      if (this.registerForm.get('email')?.errors?.['required']) {
        this.toast.showError('Preencha o campo email.');
      }
      if (this.registerForm.get('email')?.errors?.['email']) {
        this.toast.showError('Email informado é inválido');
      }
      if (this.registerForm.get('password')?.errors?.['required']) {
        this.toast.showError('Preencha o campo senha.');
      }
      if (this.registerForm.get('password')?.errors?.['minlength']) {
        this.toast.showError('Senha deve ter no mínimo 3 caracteres');
      }
      return;
    }
    const { name, email, password } = this.registerForm.getRawValue();
    this.userSvc.register(name!, email!, password!);
  }
}
