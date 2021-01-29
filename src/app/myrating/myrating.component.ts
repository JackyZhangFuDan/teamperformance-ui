import { Component, OnInit } from '@angular/core';
import {MyRating, RatingCount, RatingAverage} from '../util/evaluation';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import {DataserviceService} from '../util/dataservice.service';

@Component({
  selector: 'app-myrating',
  templateUrl: './myrating.component.html',
  styleUrls: ['./myrating.component.css']
})
export class MyratingComponent implements OnInit {

  myRatings : MyRating = {employeeId:"",employeeName:"", employeeRole:"",comments:[],ratingCounts:[]};
  ratingAverage : RatingAverage[] = [];

  title : string = "";
  myRatingsUI = [];
  commentsUI = [];
  tableColumnSortSettings = [
    {
      sortOrder: 'ascend',
      sortFn: (a, b) => a.ratingItem.localeCompare(b.ratingItem),
      sortDirections: ['ascend', 'descend', null]
    },
    {
      sortOrder: null,
      sortFn: (a, b) => a.average > b.average,
      sortDirections: ['ascend', 'descend', null]
    }
  ];

  constructor(
    private route: ActivatedRoute,
    private dataService: DataserviceService) { }

  ngOnInit(): void {
    let that = this;
    //向router注册一个回调，当参数改变时候调用
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        let employeeGuid = params.get('id');
        return of(employeeGuid);
      })
    )
    .subscribe( empGuid => {
      if(empGuid !== ""){
        this.loadMyRating(empGuid);
      }
    });
  }

  loadMyRating(empGuid : string) : void {
    this.myRatingsUI = [];
    this.commentsUI = [];
    this.title = "";
    let that = this;

    this.dataService.readMyRating(empGuid).subscribe(rts => {
      this.myRatings = rts;

      //for rating: 再去要平均数，要到后为UI组织信息
      this.dataService.readRoleAverageRating(this.myRatings.employeeRole, 2020).then((ratingAverages : RatingAverage[]) => {
        that.title = `CALM Build Project & Service Dev Team Peer Feedback Form - 2020 - ${this.myRatings.employeeName} (${this.myRatings.employeeId})`; 
        that.ratingAverage = ratingAverages;

        that.transferRatingItemForUI();
        that.translateRatingItemForUI();
      });

      //for comment: 为UI组织信息
      this.commentsUI = rts.comments;
    },
    error => {
      console.error(`error when read my ratings ${error}`);
    });
  }

  translateRatingItemForUI():void{
    this.myRatingsUI.forEach(cnt => {
      switch(cnt.ratingItem){
        case 'speed':
          cnt.ratingItem = "工作效率";
          break;
        case 'business':
          cnt.ratingItem = "对产品/业务/项目运作理解程度";
          break;
        case 'joindiscuss':
          cnt.ratingItem = "讨论参与度";
          break;
        case 'teamwork':
          cnt.ratingItem = "团队精神，顾全大局";
          break;
        case 'cooperatewithhappyness':
          cnt.ratingItem = "与她/他合作高效，顺畅，令人愉快";
          break;
      }
    });

    switch(this.myRatings.employeeRole){
      case ('dev'):
        this.myRatingsUI.forEach(cnt => {
          switch(cnt.ratingItem){
            case 'quality':
              cnt.ratingItem = "产出质量";
              break;
            case 'quantity':
              cnt.ratingItem = "产出数量";
              break;
            case 'activeness':
              cnt.ratingItem = "承担任务主动性";
              break;
          }
        });
        break;
      case ('qa'):
        this.myRatingsUI.forEach(cnt => {
          switch(cnt.ratingItem){
            case 'workload':
              cnt.ratingItem = "工作负荷";
              break;
            case 'activeness':
              cnt.ratingItem = "承担任务主动性";
              break;
          }
        });
        break;
      case ('sm'):
        this.myRatingsUI.forEach(cnt => {
          switch(cnt.ratingItem){
            case 'workload':
              cnt.ratingItem = "工作负荷";
              break;
            case 'scrum':
              cnt.ratingItem = "Scrum管理工作全面性";
              break;
            case 'activecoordinate':
              cnt.ratingItem = "主动协调，促使Sprint目标达成";
              break;
          }
        });
        break;
      case ('po'):
        this.myRatingsUI.forEach(cnt => {
          switch(cnt.ratingItem){
            case 'workload':
              cnt.ratingItem = "工作负荷";
              break;
            case 'requirement':
              cnt.ratingItem = "需求管理专业度(收集，描述，验收)";
              break;
          }
        });
        break;
    }
  }

  transferRatingItemForUI(){
    let ratingUI = [];
    this.myRatings.ratingCounts.forEach(myRating => {
      let theRatingUI = null;
      
      ratingUI.forEach(ratingUI => {
        if(ratingUI.ratingItem === myRating.ratingItem){
          theRatingUI = ratingUI;
        }
      });

      if(theRatingUI == null){
        theRatingUI = {ratingItem:myRating.ratingItem}
        //新项目肯定要有本角色平均数的
        this.ratingAverage.forEach(average => {
          if(average.role === this.myRatings.employeeRole && average.item === theRatingUI.ratingItem){
            if(average.role !== 'qa') //今年qa人只有2个，那我们就不显示平均值了
              theRatingUI.roleAverage = average.average;
            else
              theRatingUI.roleAverage = '0.0';
          }
        });
        ratingUI.push(theRatingUI);
      }

      switch(myRating.rating){
        case 0.5:
          theRatingUI.half = myRating.count;
          break;
        case 1:
          theRatingUI.one = myRating.count;
          break;
        case 1.5:
          theRatingUI.onehalf = myRating.count;
          break;
        case 2:
          theRatingUI.two = myRating.count;
          break;
        case 2.5:
          theRatingUI.twohalf = myRating.count;
          break;
        case 3:
          theRatingUI.three = myRating.count;
          break;
        case 3.5:
          theRatingUI.threehalf = myRating.count;
          break;
        case 4:
          theRatingUI.four = myRating.count;
          break;
        case 4.5:
          theRatingUI.fourhalf = myRating.count;
          break;
        case 5:
          theRatingUI.five = myRating.count;
          break;
        case 5.5:
          theRatingUI.fivehalf = myRating.count;
          break;
        case 6:
          theRatingUI.six = myRating.count;
          break;
        case 6.5:
          theRatingUI.sixhalf = myRating.count;
          break;
        case 7:
          theRatingUI.seven = myRating.count;
          break;
        case 7.5:
          theRatingUI.sevenhalf = myRating.count;
          break;
        case 8:
          theRatingUI.eight = myRating.count;
          break;
        case 8.5:
          theRatingUI.eighthalf = myRating.count;
          break;
        case 9:
          theRatingUI.nine = myRating.count;
          break;
        case 9.5:
          theRatingUI.ninehalf = myRating.count;
          break;
        case 10:
          theRatingUI.ten = myRating.count;
          break;
      }
    });

    //计算自己平均值
    ratingUI.forEach(r => {
      r.average = (
        (r.half ? r.half * 0.5 : 0) + 
        (r.one ? r.one * 1 : 0) +
        (r.onehalf ? r.onehalf * 1.5 : 0) +
        (r.two ? r.two * 2 : 0) +
        (r.twohalf ? r.twohalf * 2.5 : 0) +
        (r.three ? r.three * 3 : 0) +
        (r.threehalf ? r.threehalf * 3.5 : 0) +
        (r.four ? r.four * 4 : 0) +
        (r.fourhalf ? r.fourhalf * 4.5 : 0) +
        (r.five ? r.five * 5 : 0) +
        (r.fivehalf ? r.fivehalf * 5.5 : 0) +
        (r.six ? r.six * 6 : 0) +
        (r.sixhalf ? r.sixhalf * 6.5 : 0) +
        (r.seven ? r.seven * 7 : 0) +
        (r.sevenhalf ? r.sevenhalf * 7.5 : 0) +
        (r.eight ? r.eight * 8 : 0) +
        (r.eighthalf ? r.eighthalf * 8.5 : 0) +
        (r.nine ? r.nine * 9 : 0) +
        (r.ninehalf ? r.ninehalf * 9.5 : 0) +
        (r.ten ? r.ten * 10 : 0) 
      ) / 
      (
        (r.half ? r.half  : 0) + 
        (r.one ? r.one : 0) +
        (r.onehalf ? r.onehalf  : 0) +
        (r.two ? r.two : 0) +
        (r.twohalf ? r.twohalf : 0) +
        (r.three ? r.three : 0) +
        (r.threehalf ? r.threehalf : 0) +
        (r.four ? r.four : 0) +
        (r.fourhalf ? r.fourhalf : 0) +
        (r.five ? r.five : 0) +
        (r.fivehalf ? r.fivehalf : 0) +
        (r.six ? r.six  : 0) +
        (r.sixhalf ? r.sixhalf : 0) +
        (r.seven ? r.seven : 0) +
        (r.sevenhalf ? r.sevenhalf: 0) +
        (r.eight ? r.eight  : 0) +
        (r.eighthalf ? r.eighthalf : 0) +
        (r.nine ? r.nine  : 0) +
        (r.ninehalf ? r.ninehalf  : 0) +
        (r.ten ? r.ten  : 0) );
    });

    this.myRatingsUI = ratingUI;
  }
}
