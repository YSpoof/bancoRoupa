import { afterNextRender, Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  template: `
    <div class="flex flex-col items-center justify-center h-screen">
      <p class="text-2xl font-bold mb-4">Dashboard</p>

      @defer (on timer(500ms)) { @if (userSvc.currentAccountSig() === null) {
      <p class="text-lg">No account data available.</p>
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
      } } @placeholder {
      <p>Loading account data...</p>
      }

      <button
        (click)="loadAccountData()"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Carregar dados da conta
      </button>
      <button
        (click)="logout()"
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  `,
})
export class DashboardPageComponent {
  userSvc = inject(UserService);

  constructor() {
    afterNextRender(() => {
      this.loadAccountData();
    });
  }

  logout() {
    this.userSvc.logout();
  }

  loadAccountData() {
    this.userSvc.loadAccountData();
  }
}
