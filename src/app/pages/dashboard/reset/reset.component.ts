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
  template: `
    <div class="flex flex-col items-center justify-center h-full">
      <p class="text-2xl font-bold mb-4">
        Vamos te ajudar a recuperar sua senha
      </p>

      <form [formGroup]="resetForm" class="flex flex-col gap-2 w-80">
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
          placeholder="Nova senha"
        />
        <input
          formControlName="confirmPassword"
          type="password"
          class="border rounded p-2"
          placeholder="Confirme a nova senha"
        />
        <button
          (click)="reset()"
          class="transition-all cursor-pointer bg-yellow-500 hover:bg-yellow-600 active:scale-95 text-white font-bold py-2 px-4 rounded"
          [disabled]="!resetForm.valid"
        >
          Redefinir Senha
        </button>
        <a
          routerLink="/dashboard/login"
          class="text-blue-500 hover:text-blue-700"
          >Lembrei a senha</a
        >
      </form>
    </div>
  `,
})
export class ResetPageComponent {
  userSvc = inject(UserService);
  formBuilder = inject(FormBuilder);
  toast = inject(ToastService);
  resetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
    ]),
  });

  reset() {
    if (!this.resetForm.valid) {
      if (this.resetForm.get('email')?.errors?.['required']) {
        this.toast.showError('Preencha o campo email.');
      }
      if (this.resetForm.get('email')?.errors?.['email']) {
        this.toast.showError('Email informado é inválido');
      }
      if (this.resetForm.get('password')?.errors?.['required']) {
        this.toast.showError('Preencha o campo senha.');
      }
      if (this.resetForm.get('password')?.errors?.['minlength']) {
        this.toast.showError('Senha deve ter no mínimo 6 caracteres');
      }
      if (
        this.resetForm.get('password')?.value !==
        this.resetForm.get('confirmPassword')?.value
      ) {
        this.toast.showError('Senhas não conferem');
        return;
      }
      return;
    }

    if (
      this.resetForm.get('password')?.value !==
      this.resetForm.get('confirmPassword')?.value
    ) {
      this.toast.showError('Senhas não conferem');
      return;
    }

    const { email, password } = this.resetForm.getRawValue();
    // this.userSvc.reset(email!, password!);
  }
}
