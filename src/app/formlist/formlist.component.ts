import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CookieService } from 'ngx-cookie-service';

import {DataserviceService} from '../util/dataservice.service';

@Component({
  selector: 'app-formlist',
  templateUrl: './formlist.component.html',
  styleUrls: ['./formlist.component.css']
})
export class FormlistComponent implements OnInit {

  title:string = 'CALM Build Project & Service Dev Team Peer Feedback Forms';
  
  emptyPrompt:string = '没有未使用的反馈表格了，请联系管理员创建';
  noAvailableForm: boolean = true;

  formList : {}[]= [];

  constructor(
    private message: NzMessageService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataserviceService,
    private cookieService:CookieService) { }

  ngOnInit(): void {
    let formKey:string = this.cookieService.get("myformkey");
    if(formKey && formKey !== '' ){
      this.router.navigate([`/form/${formKey}`]);
    }else{
      this.dataService.readAvailableFormHeaders().subscribe( forms =>{
        forms.forEach((element,idx) => {
          this.formList.push({id:element.id, name:`[${element.year}] 可用反馈表${idx+1}`});
        });
        if(this.formList.length < 1){
          this.noAvailableForm = true;
        }else{
          this.noAvailableForm = false;
        }
      }, error => {
        this.formList = [];
        console.log("no form is available");
      });
    }
  }

  openForm(formId:string):void{
    //this.message.info(formId);
    this.dataService.bookFormObserve(formId).subscribe( theFormKey => {
      let json : {msg:string} = eval(theFormKey);
      if(json === null || json.msg === null){
        this.message.error("该表格已经被别人占用了，请选择其它的");
        return;
      }
      this.cookieService.set('myformkey', json.msg);
      this.router.navigate([`/form/${json.msg}`]);
    }, error => {
      this.message.error("显示该表格失败");
      return;
    });

  }

}
