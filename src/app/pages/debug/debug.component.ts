import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../services/user.service';

@Component({
  template: `
    @defer (on idle; hydrate on idle) {

    <div class="p-4">
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4">Users</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-6 py-3 text-left">Name</th>
                <th class="px-6 py-3 text-left">Email</th>
                <th class="px-6 py-3 text-left">ID</th>
                <th class="px-6 py-3 text-left">Created At</th>
                <th class="px-6 py-3 text-left">Has Refresh Token</th>
              </tr>
            </thead>
            <tbody>
              @for(user of userSvc.allUsersSig(); track user.id) {
              <tr class="border-t border-gray-300">
                <td class="px-6 py-4">{{ user.name }}</td>
                <td class="px-6 py-4">{{ user.email }}</td>
                <td class="px-6 py-4">{{ user.id }}</td>
                <td class="px-6 py-4">{{ user.createdAt }}</td>
                <td
                  (click)="copyRefreshToken(user.refreshToken ?? '')"
                  class="px-6 py-4 cursor-copy"
                >
                  {{ user.refreshToken ? 'Yes' : 'No' }}
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 class="text-2xl font-bold mb-4">Accounts</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border border-gray-300">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-6 py-3 text-left">Account ID</th>
                <th class="px-6 py-3 text-left">Owner</th>
                <th class="px-6 py-3 text-left">PiXi Key</th>
                <th class="px-6 py-3 text-left">Balance</th>
                <th class="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              @for(account of userSvc.allAccountsSig(); track account.id) {
              <tr class="border-t border-gray-300">
                <td class="px-6 py-4">{{ account.id }}</td>
                <td class="px-6 py-4">
                  {{ getAccountOwnerName(account.clientId) }}
                </td>
                <td class="px-6 py-4">{{ account.pixi }}</td>
                <td class="px-6 py-4">{{ account.balance }}</td>
                <td class="px-6 py-4">
                  {{ account.suspended ? 'Suspended' : 'Active' }}
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
    } @placeholder {
    <div class="flex items-center justify-center h-full">
      <p class="text-2xl font-bold">Loading...</p>
    </div>
    }
  `,
})
export class DebugComponent {
  userSvc = inject(UserService);
  toastSvc = inject(ToastService);

  copyRefreshToken(token: string) {
    if (!token) {
      this.toastSvc.showError('User does not have a refresh token');
      return;
    }
    navigator.clipboard.writeText(token);
    this.toastSvc.showSuccess('Refresh token copied to clipboard');
  }

  getAccountOwnerName(accountOwnerId: string) {
    return this.userSvc
      .allUsersSig()
      ?.find((user) => user.id === accountOwnerId)?.name;
  }

  ngOnInit() {
    this.userSvc.debug();
  }
}
