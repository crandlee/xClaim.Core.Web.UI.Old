import { XCoreToastService, IXCoreToastOptions } from '../xcore-toasty/xcore-toasty.service';
import { Injectable } from '@angular/core';


@Injectable()
export class LoggingService {
    constructor(private _xCoreToast: XCoreToastService) {}
    
    public error(message: string, options?: any) {
        var toastOptions = this.setToastOptions(message, options);
        this._xCoreToast.error(toastOptions);
    }

    public success(message: string, options?: any) {
        var toastOptions = this.setToastOptions(message, options);
        this._xCoreToast.success(toastOptions);
    }

    public default(message: string, options?: any) {
        var toastOptions = this.setToastOptions(message, options);
        this._xCoreToast.default(toastOptions);
    }

    public info(message: string, options?: any) {
        var toastOptions = this.setToastOptions(message, options);
        this._xCoreToast.info(toastOptions);
    }

    public warn(message: string, options?: any) {
        var toastOptions = this.setToastOptions(message, options);
        this._xCoreToast.warn(toastOptions);
    }

    public wait(message: string, options?: any) {
        var toastOptions = this.setToastOptions(message, options);
        this._xCoreToast.wait(toastOptions);
    }
    
    private setToastOptions(message: string, options?: any): IXCoreToastOptions {
        var toastOptions: IXCoreToastOptions = { message: message};        
        if (options) {
            toastOptions.showClose = options.showClose || '';
            toastOptions.timeout = options.timeout || '';
            toastOptions.title = options.title || '';
        }
        return toastOptions;
    }
}