import { EventEmitter } from 'angular2/core';
import { ToastData } from './toasty.service';
/**
 * A Toast component shows message with title and close button.
 */
export declare class Toast {
    toast: ToastData;
    closeToastEvent: EventEmitter<{}>;
    /**
     * Event handler invokes when user clicks on close button.
     * This method emit new event into ToastyContainer to close it.
     */
    close($event: any): void;
}
