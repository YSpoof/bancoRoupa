import { inject, Injectable } from '@angular/core';
import { GlobalConfig, ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastr = inject(ToastrService);

  private defaultToastConfig: Partial<GlobalConfig> = {
    closeButton: true,
    positionClass: 'toast-top-right',
    timeOut: 7000,
    progressBar: true,
    maxOpened: 1,
  };

  showSuccess(message: string, title: string = 'Sucesso!'): void {
    this.toastr.success(message, title, this.defaultToastConfig);
  }

  showError(message: string, title: string = 'Erro!'): void {
    this.toastr.error(message, title, this.defaultToastConfig);
  }

  showInfo(message: string, title: string = 'Info'): void {
    this.toastr.info(message, title, this.defaultToastConfig);
  }

  showWarning(message: string, title: string = 'Atenção'): void {
    this.toastr.warning(message, title, this.defaultToastConfig);
  }
}
