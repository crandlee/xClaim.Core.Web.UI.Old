import { Component, OnInit } from '@angular/core';
import { XCoreServices } from '../shared/service/core-services.service';
import { UserProfileService } from '../usermanagement/userprofile.service';

@Component({
    selector: 'xcore-userprofile',
    templateUrl: 'app/usermanagement/userprofile.component.html',
    providers: [UserProfileService]
})
export class UserProfileComponent implements OnInit  {

    public userName: string;
    
    constructor(private userProfileService: UserProfileService)     
    { }
    
    ngOnInit() {
        this.userProfileService.getUserProfile().subscribe(up => {
            this.userName = up.UserName;      
            console.log(up);  
        });
    }
              
}