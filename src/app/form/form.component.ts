import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import {DevEvaluation,SMEvaluation,POEvaluation,QAEvaluation, Form, Employee, Rating,Comment} from '../util/evaluation';
import {DataserviceService} from '../util/dataservice.service';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  
  title:string = "CALM Build Project & Service Dev Team Peer Feedback Form - 2020";

  formKey:string = '';

  devEvaluationsUI:DevEvaluation[] = [];
  qaEvaluationsUI:QAEvaluation[] = [];
  smEvaluationsUI:SMEvaluation[] = [];
  poEvaluationsUI:POEvaluation[] = [];

  rateTooltips = ['较低','较低','较低','较低','较低', '5.5 - 稍低；6 - 正常', '超常','超常','超常', '超常'];
  isLoading : boolean = true;

  constructor(
    private notification : NzNotificationService,
    private modal: NzModalService,
    private message: NzMessageService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataserviceService) { 
  }

  ngOnInit(): void {
    
    let that = this;
    //向router注册一个回调，当参数改变时候调用
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        let formKey = params.get('id');
        if(formKey !== this.formKey) {
          return of(formKey);
        }else{
          return of("");
        };
      })
    )
    .subscribe( theFormKey => {
      if(theFormKey !== ""){
        this.formKey = theFormKey;
        this.loadForm();
      }
    });
  }

  //下载一张表格上的Evaluation数据
  loadForm():void{
    //let loadingMsgId = this.message.loading('表格内容下载中..', { nzDuration: 10000 }).messageId;
    this.isLoading = true;
    this.dataService.readForm(this.formKey).subscribe( (theForm:{form:Form; employees:Employee[]; ratings:Rating[]; comments:Comment[]}) => {
      this.devEvaluationsUI = [];
      this.qaEvaluationsUI = [];
      this.smEvaluationsUI = [];
      this.poEvaluationsUI = [];

      for(let i = 0; i < theForm.employees.length; i++){
        let emp: Employee = theForm.employees[i];
        switch(emp.role){
          case 'dev':
            let evalu : DevEvaluation = {employeeId:"",employeeName:"",employeeRole:"",speed: 0,quality: 0,quantity: 0,business: 0,activeness: 0,joindiscuss: 0,teamwork: 0,cooperatewithhappyness: 0,comment:"",expend:false};
            evalu.employeeId = emp.id;
            evalu.employeeName = emp.name;
            evalu.employeeRole = emp.role;
            evalu.expend = false;
            theForm.ratings.forEach( (rt : Rating) => {
              if(rt.employeeId === emp.id && rt.role === emp.role){
                switch(rt.ratingItem){
                  case 'speed':
                    evalu.speed = rt.rating;
                    break;
                  case 'quality':
                    evalu.quality = rt.rating;
                    break;
                  case 'quantity':
                    evalu.quantity = rt.rating;
                    break;
                  case 'activeness':
                    evalu.activeness = rt.rating;
                    break;
                  case 'business':
                    evalu.business = rt.rating;
                    break;
                  case 'joindiscuss':
                    evalu.joindiscuss = rt.rating;
                    break;
                  case 'teamwork':
                    evalu.teamwork = rt.rating;
                    break;
                  case 'cooperatewithhappyness':
                    evalu.cooperatewithhappyness = rt.rating;
                    break;
                }
              }
            });
            if (theForm.comments !== null)
              theForm.comments.forEach((comment:Comment) => {
                if(comment.employeeId === emp.id && comment.role === emp.role){
                  evalu.comment = comment.comment;
                }
              });
            this.devEvaluationsUI.push(evalu);
            break;

          case 'qa':
            let evaluQa : QAEvaluation = {employeeId:"",employeeName:"",employeeRole:"",speed: 0,workload: 0,business: 0,activeness: 0,joindiscuss: 0,teamwork: 0,cooperatewithhappyness: 0,comment:"",expend:false};
            evaluQa.employeeId = emp.id;
            evaluQa.employeeName = emp.name;
            evaluQa.employeeRole = emp.role;
            evaluQa.expend = false;
            theForm.ratings.forEach( (rt : Rating) => {
              if(rt.employeeId === emp.id && rt.role === emp.role){
                switch(rt.ratingItem){
                  case 'speed':
                    evaluQa.speed = rt.rating;
                    break;
                  case 'workload':
                    evaluQa.workload = rt.rating;
                    break;
                  case 'activeness':
                    evaluQa.activeness = rt.rating;
                    break;
                  case 'business':
                    evaluQa.business = rt.rating;
                    break;
                  case 'joindiscuss':
                    evaluQa.joindiscuss = rt.rating;
                    break;
                  case 'teamwork':
                    evaluQa.teamwork = rt.rating;
                    break;
                  case 'cooperatewithhappyness':
                    evaluQa.cooperatewithhappyness = rt.rating;
                    break;
                }
              }
            });
            if (theForm.comments !== null)
              theForm.comments.forEach((comment:Comment) => {
                if(comment.employeeId === emp.id && comment.role === emp.role){
                  evaluQa.comment = comment.comment;
                }
              });
            this.qaEvaluationsUI.push(evaluQa);
            break;

          case 'sm':
            let evaluSm : SMEvaluation = {employeeId:"",employeeName:"",employeeRole:"",speed: 0,workload: 0,scrum: 0,business: 0,activecoordinate: 0,joindiscuss: 0,teamwork: 0,cooperatewithhappyness: 0,comment:"",expend:false};
            evaluSm.employeeId = emp.id;
            evaluSm.employeeName = emp.name;
            evaluSm.employeeRole = emp.role;
            evaluSm.expend = false;
            theForm.ratings.forEach( (rt : Rating) => {
              if(rt.employeeId === emp.id && rt.role === emp.role){
                switch(rt.ratingItem){
                  case 'speed':
                    evaluSm.speed = rt.rating;
                    break;
                  case 'workload':
                    evaluSm.workload = rt.rating;
                    break;
                  case 'scrum':
                    evaluSm.scrum = rt.rating;
                    break;
                  case 'activecoordinate':
                    evaluSm.activecoordinate = rt.rating;
                    break;
                  case 'business':
                    evaluSm.business = rt.rating;
                    break;
                  case 'joindiscuss':
                    evaluSm.joindiscuss = rt.rating;
                    break;
                  case 'teamwork':
                    evaluSm.teamwork = rt.rating;
                    break;
                  case 'cooperatewithhappyness':
                    evaluSm.cooperatewithhappyness = rt.rating;
                    break;
                }
              }
            });
            if (theForm.comments !== null)
              theForm.comments.forEach((comment:Comment) => {
                if(comment.employeeId === emp.id && comment.role === emp.role){
                  evaluSm.comment = comment.comment;
                }
              });
            this.smEvaluationsUI.push(evaluSm);
            break;

          case 'po':
            let evaluPo : POEvaluation = {employeeId:"",employeeName:"",employeeRole:"",speed: 0,workload: 0,requirement: 0,business: 0,joindiscuss: 0,teamwork: 0,cooperatewithhappyness: 0,comment:"",expend:false};
            evaluPo.employeeId = emp.id;
            evaluPo.employeeName = emp.name;
            evaluPo.employeeRole = emp.role;
            evaluPo.expend = false;
            theForm.ratings.forEach( (rt : Rating) => {
              if(rt.employeeId === emp.id && rt.role === emp.role){
                switch(rt.ratingItem){
                  case 'speed':
                    evaluPo.speed = rt.rating;
                    break;
                  case 'workload':
                    evaluPo.workload = rt.rating;
                    break;
                  case 'requirement':
                    evaluPo.requirement = rt.rating;
                    break;
                  case 'business':
                    evaluPo.business = rt.rating;
                    break;
                  case 'joindiscuss':
                    evaluPo.joindiscuss = rt.rating;
                    break;
                  case 'teamwork':
                    evaluPo.teamwork = rt.rating;
                    break;
                  case 'cooperatewithhappyness':
                    evaluPo.cooperatewithhappyness = rt.rating;
                    break;
                }
              }
            });
            if (theForm.comments !== null)
              theForm.comments.forEach((comment:Comment) => {
                if(comment.employeeId === emp.id && comment.role === emp.role){
                  evaluPo.comment = comment.comment;
                }
              });
            this.poEvaluationsUI.push(evaluPo);
            break;
        }
      };
      this.isLoading = false;
      this.modal.info({
        nzTitle: '友情提示',
        nzContent: '<p>建议<b>收藏本页面</b>到你的浏览器, 便于之后打开修改。<br><br>为实现匿名，这个URL将是你再次进入这张反馈表的唯一方式，如果你需要后续查看或修改反馈内容，请务必收藏。</p>',
        nzOnOk: () => console.log('Info OK')
      });
    }, error => {
      this.isLoading = false;
      this.message.error("看样子这个反馈表不存在",{nzDuration:10000});
    });
  }

  onRating(item:string,data:any,evt:any):void{
    let re: Observable<string> = null;
    switch(item){
      case 'speed':
        re = this.dataService.rate(this.formKey, data.employeeId,data.employeeRole, 'speed', data.speed);
        break;
      case 'quality':
        re = this.dataService.rate(this.formKey, data.employeeId,data.employeeRole, 'quality', data.quality);
        break;
      case 'quantity':
        re = this.dataService.rate(this.formKey, data.employeeId,data.employeeRole, 'quantity', data.quantity);
        break;
      case 'activeness':
        re = this.dataService.rate(this.formKey, data.employeeId,data.employeeRole, 'activeness', data.activeness);
        break;
      case 'business':
        re = this.dataService.rate(this.formKey, data.employeeId,data.employeeRole, 'business', data.business);
        break;
      case 'joindiscuss':
        re = this.dataService.rate(this.formKey, data.employeeId,data.employeeRole, 'joindiscuss', data.joindiscuss);
        break;
      case 'teamwork':
        re = this.dataService.rate(this.formKey, data.employeeId,data.employeeRole, 'teamwork', data.teamwork);
        break;
      case 'cooperatewithhappyness':
        re = this.dataService.rate(this.formKey, data.employeeId,data.employeeRole, 'cooperatewithhappyness', data.cooperatewithhappyness);
        break;
      case 'workload':
        re = this.dataService.rate(this.formKey, data.employeeId,data.employeeRole, 'workload', data.workload);
        break;
      case 'scrum':
        re = this.dataService.rate(this.formKey, data.employeeId,data.employeeRole, 'scrum', data.scrum);
        break;
      case 'activecoordinate':
        re = this.dataService.rate(this.formKey, data.employeeId,data.employeeRole, 'activecoordinate', data.activecoordinate);
        break;
      case 'requirement':
        re = this.dataService.rate(this.formKey, data.employeeId,data.employeeRole, 'requirement', data.requirement);
        break;
    }
    if(re !== null){
      re.subscribe(msg => {
        let json : {msg:string} = eval(msg);
        if(json.msg === "deleted"){
          this.message.success("成功取消了评分");
        }else{
          this.message.success(`评分成功, 得分为${json.msg}`);
        }
      }, error => {
        this.message.error(`评分失败：${error}` );
      });
    }else{
      this.message.error("未知的评分项");
    }

  }

  onExpandChange(data:any, event : any){
    if(event === true){
      this.notification.blank(
        '注意',
        '输入完毕后，折起输入框行进行保存'
      );
    }else{
      let re: Observable<string> = null;
      re = this.dataService.comment(this.formKey, data.employeeId, data.employeeRole, data.comment);
      if (re !== null){
        re.subscribe(msg => {
          let json : {msg:string} = eval(msg);
          if(json.msg === "added"){
            this.message.success("文字反馈成功");
          }else{
            this.message.error("文字反馈失败");
          }
        }, error=>{
          this.message.error("请求失败");
        });
      }
    }
  }

  showInfo(item:string):void{
    let content : string = '未知项目';
    switch(item){
      case ("workload"):
        content = "日常忙碌状态的一种反应。我们组需要加班的情况比较少见，但还是会有同事每天都有做不完的工作，事项排得满满的，需要自己开足马力全天候聚精会神。<br><br> 一个比较简单的标准：用Rating 6 来代表每天8小时毫无压力地，按部就班地就可以完成工作而不误事；"+
                  "用低于Rating 6来代表你认为对方每天花在工作上的时间不足6~8小时；用高于6代表不懈怠的情况下工作还是排得很满很长。";
        break;
      case ("business"):
        content = "所有的角色都需要对自己的产品功能了如指掌，它支持的业务场景是什么；知道项目中重要过程是如何运行，例如对于CALM，Daily Delivery过程是什么？Feature Release的过程是什么？等等";
        break;
      case ("joindiscuss"):
        content = "一种积极参与贡献想法的态度，而不是一副旁观者的姿态，我只管干活儿的行为方式。大组讨论，项目组讨论；团队管理话题，技术话题，项目话题";
        break;
      case ("teamwork"):
        content = "为了项目目标达成，愿意主动承担一些，多承担一些，给人不过于计较的感觉；面对同事遇到的困难，主动伸出援手或是被请求帮助时耐心，热心";
        break;
      case ("cooperatewithhappyness"):
        content = "一个概括性的感觉，既包含工作的专业程度给人的感觉，也包含合作过程中的交流，交换意见，彼此协调过程中给人的感觉";
        break;
      case ("scrum"):
        content = "Scrum有基本过程框架，各个固定环节是否有？为了达到更好的效果， SM可能自己会添加管理环节，这是全面性的体现";
        break;
      case ("activecoordinate"):
        content = "执行Scrum框架是否只走过场的感觉重？能否在Sprint进行过程主动发现问题，推动解决，促使目标达成";
        break;
      case ("requirement"):
        content = "多渠道，敏感地收集需求，描述需求的完善和准确，响应Team的及时，验收";
        break;
    }
    this.modal.info({
      nzTitle: '项目释义',
      nzContent: content,
      nzOnOk: () => console.log('confirm item meaning')
    });
  }
}
