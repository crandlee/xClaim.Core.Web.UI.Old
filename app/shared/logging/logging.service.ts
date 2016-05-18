import { XCoreToastService, IXCoreToastOptions } from '../xcore-toasty/xcore-toasty.service';
import { Injectable } from '@angular/core';


@Injectable()
export class LoggingService {
    constructor(private xCoreToast: XCoreToastService) {}
    
    private performLogging(consolePrefix: string, toastFunc: Function, style: string, message: string, options?: IxLoggingOptions) {
        if (!options || !options.noToast) {
            var toastOptions = this.setToastOptions(message, options);
            toastFunc(toastOptions);            
        }
        if (!options || !options.noConsole) {
            console.log(`%c${consolePrefix}: ${message}`, `${style}`);
        }        
    }
    
    public error(message: string, options?: IxLoggingOptions) {
        this.performLogging("Error", this.xCoreToast.error.bind(this.xCoreToast),  'background: red; color: white', message, options);
    }

    public success(message: string, options?: IxLoggingOptions) {
        this.performLogging("Success", this.xCoreToast.success.bind(this.xCoreToast), 'background: green; color: white', message, options);
    }

    public default(message: string, options?: IxLoggingOptions) {
        this.performLogging("Default", this.xCoreToast.default.bind(this.xCoreToast), 'background: black; color: white', message, options);        
    }

    public info(message: string, options?: IxLoggingOptions) {
        this.performLogging("Info", this.xCoreToast.info.bind(this.xCoreToast), 'background: blue; color: white', message, options);
    }

    public warn(message: string, options?: IxLoggingOptions) {
        this.performLogging("Warning", this.xCoreToast.warn.bind(this.xCoreToast), 'background: yellow; color: black', message, options);
    }

    public wait(message: string, options?: IxLoggingOptions) {
        this.performLogging("Wait", this.xCoreToast.wait.bind(this.xCoreToast), 'background: orange; color: black', message, options);
    }
    
    private setToastOptions(message: string, options?: IxLoggingOptions): IXCoreToastOptions {
        var toastOptions: IXCoreToastOptions = { message: message};        
        if (options) {
            toastOptions.showClose = options.showClose || true;
            toastOptions.timeout = options.timeout || 5;
            toastOptions.title = options.title || "";
        }
        return toastOptions;
    }
}

export interface IxLoggingOptions {
    showClose?: boolean,
    timeout?: number,
    title?: string,
    noConsole?: boolean,
    noToast?: boolean    
}