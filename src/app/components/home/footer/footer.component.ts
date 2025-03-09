import { Component, inject } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { ToastService } from '../../../services/toast.service';
import { HelloApiResponse } from '../../../types';

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
        <button
          (click)="testBackend()"
          class="text-white px-4 py-2 bg-vb-black-secondary"
        >
          Testar backend
        </button>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  private client = inject(HttpService);
  private toast = inject(ToastService);

  testBackend() {
    this.client.get<HelloApiResponse>('/api/hello').subscribe({
      next: (response) => {
        this.toast.showToast(response.message, 'Sucesso', 'success');
        console.log(response);
        console.log(typeof response);
      },
      error: (err) => {
        this.toast.showToast('Error: ' + err.message, 'Erro padrão', 'error');
      },
    });
    this.client.get<HelloApiResponse>('/api/error').subscribe({
      error: (err) => {
        console.log(err);
        console.log(typeof err);
        this.toast.showToast(err.error.message, 'Erro Custom', 'error');
      },
    });
  }
}
