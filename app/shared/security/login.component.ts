import { Component } from '@angular/core';
import { XCoreServices } from '../service/core-services.service';

@Component({
    template: '<div></div>',
    providers: []
})
export class LoginComponent  {
    constructor(private xCoreServices: XCoreServices) {
        this.xCoreServices.SecurityService
            .Authorize();
    }
}