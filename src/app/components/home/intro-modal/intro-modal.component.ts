import { Component } from '@angular/core';

@Component({
  selector: 'app-intro-modal',
  imports: [],
  template: `
    <div class="rounded-md outline p-4 bg-bcrblack/80 backdrop-blur-md">
      <h2>Acesse sua Dashboard</h2>
      <p>Aqui é pra ficar algum modal</p>
    </div>
  `,
})
export class IntroModalComponent {}
