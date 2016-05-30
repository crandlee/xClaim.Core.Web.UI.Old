import { Component, OnInit } from '@angular/core';
import { XCoreServices } from '../service/core-services.service';
import { XCoreBaseComponent } from '../component/base.component';

@Component({
    template: '<div></div>',
    providers: []
})
export class LoginComponent extends XCoreBaseComponent implements OnInit {
    constructor(protected xCoreServices: XCoreServices) {
        super(xCoreServices);
    }
    ngOnInit() {
        this.xCoreServices.SecurityService.Authorize();
    }
}