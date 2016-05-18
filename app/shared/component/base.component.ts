import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { XCoreServices } from '../service/core-services.service';

export class XCoreBaseComponent implements OnInit  {
    
    constructor(protected xCoreServices: XCoreServices) { }
    
    ngOnInit() {
            
        this.xCoreServices.LoggingService.info(`Loaded ${this.xCoreServices.Router.serializeUrl(this.xCoreServices.Router.urlTree)}`, { noToast: true });    
            
    }
              
}
