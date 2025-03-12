import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  template: `
    <div class="flex flex-col items-center justify-center h-screen">
      <p class="text-2xl font-bold mb-4">Dashboard</p>
      <button
        (click)="logout()"
        class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>
  `,
  styles: ``,
})
export class DashboardPageComponent {
  userSvc = inject(UserService);
  logout() {
    this.userSvc.logout();
  }
}
