import { Component, OnInit, EventEmitter } from '@angular/core';
import { XCoreServices } from '../shared/service/core-services.service';
import { UserProfileService } from '../usermanagement/userprofile.service';
import { XCoreBaseComponent } from '../shared/component/base.component';

@Component({
    templateUrl: 'app/usermanagement/userprofile.component.html',
    providers: [UserProfileService]
})
export class UserProfileComponent extends XCoreBaseComponent implements OnInit  {

    public userName: string;
    
    constructor(protected xCoreServices: XCoreServices, private userProfileService: UserProfileService)     
    {  
        super(xCoreServices);
    }
    
    ngOnInit() {
        super.ngOnInit();
        this.userProfileService.getUserProfile().subscribe(up => {
            this.userName = up.UserName;      
            console.log(up);
        });
    }
              
}