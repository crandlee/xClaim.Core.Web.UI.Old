import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { XCoreServices, TraceMethodPosition } from '../service/core-services.service';

export class XCoreBaseComponent implements OnInit  {
    
    protected classTrace: (methodName: string) => (methodPosition: TraceMethodPosition, extraMessage?: string) => void;

    constructor(protected xCoreServices: XCoreServices) {
        this.classTrace = this.xCoreServices.LoggingService.getTraceFunction("UnspecifiedService");
     }
    
    protected initializeTrace(className: string) {
        this.classTrace = this.xCoreServices.LoggingService.getTraceFunction(className);
    }

    protected NotifyLoaded(componentName: string) {                            
        this.xCoreServices.LoggingService.info(`Component: ${componentName}`, { noToast: true });
        this.xCoreServices.LoggingService.info(`Route: ${this.xCoreServices.Router.serializeUrl(this.xCoreServices.Router.urlTree) || "root"}`, { noToast: true });            
    }
              
}
