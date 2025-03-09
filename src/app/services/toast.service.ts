import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

type ToastType = 'success' | 'error' | 'info' | 'warning';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastr = inject(ToastrService);

  showToast(
    message: string = 'VestBank',
    title: string = 'VestBank',
    type: ToastType = 'success'
  ): void {
    let positionClass = 'toast-top-center';
    let closeButton = true;

    const toastConfig = { closeButton, positionClass };

    switch (type) {
      case 'error':
        this.toastr.error(message, title, toastConfig);
        break;
      case 'info':
        this.toastr.info(message, title, toastConfig);
        break;
      case 'warning':
        this.toastr.warning(message, title, toastConfig);
        break;
      default:
        this.toastr.success(message, title, toastConfig);
    }
  }
}
