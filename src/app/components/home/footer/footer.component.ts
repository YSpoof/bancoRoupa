import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    <footer class="bg-vb-black p-4 w-full">
      <div
        class="container mx-auto text-center flex justify-center items-center gap-4"
      >
        <p class="text-white">
          Desenvolvido por <a href="#">Igor</a> e <a href="#">Luís</a>
        </p>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
