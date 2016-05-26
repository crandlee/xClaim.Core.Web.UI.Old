import { XCoreToastService, IXCoreToastOptions } from '../xcore-toasty/xcore-toasty.service';
import { Injectable } from '@angular/core';
import _ from 'lodash';



@Injectable()
export class LoggingService {

    constructor(private xCoreToast: XCoreToastService) 
    {}
    
    private performLogging(consolePrefix: string, toastFunc: Function, style: string, message: string, toastMessage: string, options?: IxLoggingOptions) {
        if (!options || !options.noToast) {
            if (!toastMessage) toastMessage = message;
            var toastOptions = this.setToastOptions(toastMessage, options);
            if (toastFunc) toastFunc(toastOptions);            
        }
        if (!options || !options.noConsole) {
            var msg:string = _.isObject(message) ? window.CircularJSON.stringify(message).substring(0, 200) : message;
            console.log(`%c${consolePrefix}: ${msg}`, `${style}`);
        }        
    }
    
    public error(errorMessage: any, userMessage?: string, options?: IxLoggingOptions) {
        this.performLogging("Error", this.xCoreToast.error.bind(this.xCoreToast),  'background: red; color: white', errorMessage, userMessage, options);
    }

    public success(message: any, options?: IxLoggingOptions) {
        this.performLogging("Success", this.xCoreToast.success.bind(this.xCoreToast), 'background: green; color: white', message, null, options);
    }

    public debug(message: any, options?: IxLoggingOptions) {
        //No toast for debug        
        this.performLogging("Debug", null, 'background: black; color: white', message, null, options);        
    }

    public info(message: any, options?: IxLoggingOptions) {
        this.performLogging("Info", this.xCoreToast.info.bind(this.xCoreToast), 'background: blue; color: white', message, null, options);
    }

    public warn(errorMessage: any, userMessage?: string, options?: IxLoggingOptions) {
        this.performLogging("Warning", this.xCoreToast.warn.bind(this.xCoreToast), 'background: yellow; color: black', errorMessage, userMessage, options);
    }

    public wait(message: any, options?: IxLoggingOptions) {
        this.performLogging("Wait", this.xCoreToast.wait.bind(this.xCoreToast), 'background: orange; color: black', message, null, options);
    }
    
    private setToastOptions(message: any, options?: IxLoggingOptions): IXCoreToastOptions {
        var msg:string = _.isObject(message) ? window.CircularJSON.stringify(message).substring(0, 200) : message;
        var toastOptions: IXCoreToastOptions = { message: msg };        
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