import { afterNextRender, Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  template: `
    <div class="flex flex-col items-center justify-center h-screen">
      <p class="text-2xl font-bold mb-4">Dashboard</p>
      @if (userSvc.currentAccountSig() === null) {
      <p class="text-lg">Dados da conta não disponíveis...</p>
      } @else {
      <ul>
        @for (account of userSvc.currentAccountSig()!; track account.pixi) { @if
        (!account.suspended) {
        <li>
          Chave: {{ account.pixi }} | Saldo:
          {{ account.balance }}
        </li>
        } @else {
        <li>Conta suspensa: {{ account.balance }}</li>
        } }
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

  constructor() {
    afterNextRender(() => {
      this.loadAccountData();
      this.toast.showSuccess(
        `Bem-vindo(a), ${this.userSvc.currentUserSig()!.name}`
      );
    });
  }

  logout() {
    this.userSvc.logout();
    this.toast.showWarning('Logout efetuado com sucesso!');
  }

  delete() {
    this.userSvc.delete();
    this.toast.showError('Conta deletada com sucesso!');
  }

  loadAccountData() {
    this.userSvc.loadAccountData();
    this.toast.showInfo('Dados da conta carregados com sucesso!');
  }
}
