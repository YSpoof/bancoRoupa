import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  template: `
    <header class="bg-vb-black p-4 w-full sticky top-0 z-10">
      <nav class="container mx-auto flex gap-4 justify-between">
        <a
          routerLink="/"
          class="transition-colors text-white hover:text-vb-primary font-bold self-center text-2xl"
          >VestBank</a
        >
        <div class="flex gap-4">
          <a
            routerLink="/dashboard"
            class="px-4 py-2 font-bold transition-all rounded-md bg-vb-black-secondary hover:bg-vb-tertiary active:scale-95 text-white"
            >Painel</a
          >
          <a
            routerLink="/debug"
            class="px-4 py-2 font-bold transition-all rounded-md bg-vb-black-secondary hover:bg-vb-tertiary active:scale-95 text-white"
            >DEBUG</a
          >
        </div>
      </nav>
    </header>
  `,
})
export class HeaderComponent {}
