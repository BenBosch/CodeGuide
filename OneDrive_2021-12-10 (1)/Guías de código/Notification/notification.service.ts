import { Injectable, Inject, ViewContainerRef } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

import { AppMessages } from '../../app-messages.module';

@Injectable()
export class NotificationService {
    constructor(@Inject('APP_MESSAGES') public messages: AppMessages, private toastr: ToastrService) {
    }

    showSuccess(title: string, message: string) {
        this.toastr.success(message, title);
    }

    showError(title: string, message: string) {
        this.toastr.error(message, title);
    }

    showWarning(title: string, message: string) {
        this.toastr.warning(message, title);
    }

    showInfo(title: string, message: string) {
        this.toastr.info(message, title);
    }
}
