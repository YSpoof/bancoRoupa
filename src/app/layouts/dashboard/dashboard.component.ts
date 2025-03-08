import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule],
  template: `
    <p>Dashboard LAYOUT works!</p>
    <router-outlet></router-outlet>
  `,
})
export class DashboardLayoutComponent {}
