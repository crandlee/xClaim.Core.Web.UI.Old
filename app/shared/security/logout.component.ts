import { Component, OnInit } from '@angular/core';
import { XCoreServices } from '../service/core-services.service';

@Component({
    template: '<div></div>',
    providers: [XCoreServices]
})
export class LogoutComponent implements OnInit {
    constructor(private xCoreServices: XCoreServices) {}
    ngOnInit() {
        this.xCoreServices.SecurityService.Logoff();
    }
}