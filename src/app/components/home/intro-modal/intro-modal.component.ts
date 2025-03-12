import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-intro-modal',
  imports: [RouterModule],
  template: `
    <div
      class="rounded-md outline p-4 bg-vb-black/80 backdrop-blur-md max-w-48 mx-auto"
    >
      <div>
        <h2 class="text-2xl text-center mb-4">Cadastre-se já</h2>
        <p>
          Faça parte do nosso time e aproveitar as vantagens que só o VestBank
          pode oferecer.
        </p>
      </div>
      <a
        routerLink="/dashboard/register"
        class="block transition-all text-center mt-4 mx-auto px-4 py-2 cursor-pointer bg-vb-tertiary hover:bg-vb-secondary active:scale-95"
      >
        Cadastrar
      </a>
    </div>
  `,
})
export class IntroModalComponent {}
