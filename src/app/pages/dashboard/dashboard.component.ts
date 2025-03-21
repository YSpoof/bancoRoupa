import { afterNextRender, Component, inject, signal } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';
import { AccountResponse } from '../../types/api';

@Component({
  selector: 'app-dashboard',
  imports: [],
  template: `
    <div class="flex flex-col items-center justify-center h-screen">
      <p class="text-2xl font-bold mb-4">Dashboard</p>
      @if (account() === null) {
      <p class="text-lg">Dados da conta não disponíveis...</p>
      } @else {
      <ul>
        @if (!account()!.suspended) {
        <li>
          Chave: {{ account()!.pixi }} | Saldo:
          {{ account()!.balance }}
        </li>
        } @else {
        <li>Conta suspensa: {{ account()!.balance }}</li>
        }
      </ul>
      }

      <button
        (click)="loadAccountData()"
        class="transition-all cursor-pointer bg-blue-500 hover:bg-blue-700 active:scale-95 text-white font-bold py-2 px-4 rounded"
      >
        Carregar dados da conta
      </button>
      <button
        (click)="logout()"
        class="transition-all cursor-pointer bg-yellow-500 hover:bg-yellow-700 active:scale-95 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
      <button
        (click)="delete()"
        class="transition-all cursor-pointer bg-red-500 hover:bg-red-700 active:scale-95 text-white font-bold py-2 px-4 rounded"
      >
        Deletar conta
      </button>
    </div>
  `,
})
export class DashboardPageComponent {
  userSvc = inject(UserService);
  toast = inject(ToastService);
  account = signal<AccountResponse | null>(null);

  constructor() {
    afterNextRender(() => {
      this.loadAccountData();
    });
  }

  logout() {
    this.userSvc.doLogout();
    this.toast.showWarning('Logout efetuado com sucesso!');
  }

  delete() {
    if (
      confirm(
        'Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.'
      )
    ) {
      this.userSvc.doDelete().subscribe({
        next: (res) => {
          this.userSvc.doLogout();
          this.toast.showSuccess(res.message);
        },
        error: (e) => {
          this.toast.showError(
            e.error ? e.error.message : 'Erro ao deletar conta!'
          );
        },
      });
    }
  }

  loadAccountData() {
    this.account.set(null);
    this.userSvc.getAccountData().subscribe({
      next: (res) => {
        this.account.set(res);
        this.toast.showInfo('Dados da conta carregados com sucesso!');
      },
      error: (_err) => {
        this.account.set(null);
        this.userSvc.getNewToken();
      },
    });
  }
}
