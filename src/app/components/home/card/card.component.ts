import { Component, input } from '@angular/core';

@Component({
  selector: 'app-card',
  imports: [],
  template: `
    <div class="border h-full">
      <div class="p-4 bg-vb-black-secondary/90 h-full">
        <h2 class="mb-2 font-bold text-xl text-vb-primary text-center">
          {{ title() }}
        </h2>
        <hr />
        <p class="text-vb-secondary mt-2">
          <ng-content />
        </p>
      </div>
    </div>
  `,
})
export class CardComponent {
  title = input('Title');
}
