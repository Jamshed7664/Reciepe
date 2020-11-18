import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { MyServicesService } from '../my-services.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit,OnDestroy {
userSub:Subscription;
isAuthenticated:boolean=false;
  constructor(private myService:MyServicesService) { }

  ngOnInit(): void {
 this.userSub=this.myService.user.subscribe(auth =>{
    if(auth){
     this.isAuthenticated=true;
   }

 })
  }
ngOnDestroy(){
this.userSub.unsubscribe()
}
}
