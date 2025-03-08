import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  template: `
    <header class="bg-bcrblack p-4 w-full">
      <nav class="container mx-auto flex justify-between">
        <a routerLink="/" class="text-white font-bold self-center text-2xl"
          >VB</a
        >
        <div class="flex gap-4">
          <a
            routerLink="dashboard"
            class="px-4 py-2 font-bold transition-colors rounded-md bg-bcrdarkgreen hover:bg-bcrmediumgreen text-white"
            >Painel</a
          >
          <a
            routerLink="login"
            class="px-4 py-2 font-bold transition-colors rounded-md bg-bcrdarkgreen hover:bg-bcrmediumgreen text-white"
            >Login</a
          >
          <a
            routerLink="register"
            class="px-4 py-2 font-bold transition-colors rounded-md bg-bcrdarkgreen hover:bg-bcrmediumgreen text-white"
            >Cadastrar</a
          >
        </div>
      </nav>
    </header>
  `,
})
export class HeaderComponent {}
