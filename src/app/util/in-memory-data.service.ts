import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo, ParsedRequestUrl, RequestInfoUtilities, ResponseOptions,getStatusText, STATUS} from 'angular-in-memory-web-api';

import { Observable, of }  from 'rxjs';
import { delay } from 'rxjs/operators';

import { Form, Employee, Rating, Comment} from './evaluation'
import { getAttrsForDirectiveMatching } from '@angular/compiler/src/render3/view/util';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  private forms: Form[] = [{
    id:'form1',
    key:'',
    year:2020
  },{
    id:'form2',
    key:'',
    year:2020
  },{
    id:'form3',
    key:'form3_key',
    year:2020
  }];

  private employees: Employee[] = [{
    id:"emp_1",
    role:"dev", //dev,qa,sm,po,ux
    name:"Jacky",
    status:1 //0:inactive; 1:active
  },{
    id:"emp_2",
    role:"dev", //dev,qa,sm,po,ux
    name:"Eric",
    status:1 //0:inactive; 1:active
  },{
    id:"emp_3",
    role:"qa", //dev,qa,sm,po,ux
    name:"Minna",
    status:1 //0:inactive; 1:active
  },{
    id:"emp_4",
    role:"sm", //dev,qa,sm,po,ux
    name:"Sasha",
    status:1 //0:inactive; 1:active
  },{
    id:"emp_5",
    role:"sm", //dev,qa,sm,po,ux
    name:"Grace",
    status:1 //0:inactive; 1:active
  },{
    id:"emp_6",
    role:"po", //dev,qa,sm,po,ux
    name:"Tony",
    status:1 //0:inactive; 1:active
  }];

  private ratings : Rating[] = [{
    formKey:"form3_key",
    employeeId:"emp_1",
    role:"dev",
    ratingItem:"speed",
    rating:5.5
  },{
    formKey:"form3_key",
    employeeId:"emp_1",
    role:"dev",
    ratingItem:"quantity",
    rating:8
  }];

  private comments : Comment[] = [{
    formKey:"form3_key",
    employeeId:"emp_1",
    role:"dev",
    comment:"he is a good member"
  }];

  constructor() { }

  createDb(reqInfo?: RequestInfo): {} | import("rxjs").Observable<{}> | Promise<{}> {

    let returnType  = 'object';
    if (reqInfo) {
      const body = reqInfo.utils.getJsonBody(reqInfo.req) || {};
      if (body.clear === true) {
        this.forms.length = 0;
        this.employees.length = 0;
        this.ratings.length = 0;
      }
      // 'returnType` can be 'object' | 'observable' | 'promise'
      returnType = body.returnType || 'object';
    }

    let forms = this.forms;
    let employees = this.employees;
    let ratings = this.ratings;
    const db = {forms,employees,ratings};

    switch (returnType) {
      case ('observable'):
        return of(db).pipe(delay(3));
      case ('promise'):
        return new Promise(resolve => {
          setTimeout(() => resolve(db), 3);
        });
      default:
        return db;
    }
  }

  // HTTP GET interceptor
  get(reqInfo: RequestInfo) {
    const api = reqInfo.apiBase;
    const collectionName = reqInfo.collectionName

    if (api.startsWith('formapi')) {
      switch (collectionName){
        case ('forms'): //读取所有没有被占用的forms
          let theForms : Form[] = [];
          this.forms.forEach((aform,idx) =>{
            if(aform.key === ''){
              theForms.push({id:aform.id,key:aform.key, year:aform.year});
            }
          });
          return reqInfo.utils.createResponse$(() => {
            const options: ResponseOptions = theForms.length > 0 ?
              {
                body: theForms,
                status: STATUS.OK
              } :
              {
                body: { error: `all forms are used, no one available` },
                status: STATUS.NOT_FOUND
              };
            return this.finishOptions(options, reqInfo);
          });
          break;
        case ('form'): //读取单个form的全部数据
          let theForm: Form = null;
          let emps: Employee[] = [];
          let rt: Rating[] = [];
          let cm:Comment[] = [];

          this.ratings.forEach((aRating, idx) => {
            if(aRating.formKey === reqInfo.id){
              rt.push(aRating);
            }
          });

          this.comments.forEach((aComment,idx) => {
            if(aComment.formKey === reqInfo.id){
              cm.push(aComment);
            }
          });

          this.forms.forEach((aform,idx) => {
            if(aform.key === reqInfo.id){
              theForm = aform;
            }
          });

          this.employees.forEach((emp, idx) => {
            if(emp.status === 1){
              emps.push(emp);
            }
          });

          return reqInfo.utils.createResponse$(() => {
            const options: ResponseOptions = theForm !== null ?
              {
                body: {form:theForm,employees:emps, ratings:rt, comments:cm},
                status: STATUS.OK
              } :
              {
                body: { error: `not found the form with key ${reqInfo.id}` },
                status: STATUS.NOT_FOUND
              };
              return this.finishOptions(options, reqInfo);
          });
          break;
      }
    }
    return undefined; // let the default GET handle all others
  }

  //http POST interceptor
  post(reqInfo: RequestInfo) {
    const api = reqInfo.apiBase;
    const collectionName = reqInfo.collectionName
    const formKey:string = reqInfo.id;
    if (api.startsWith('formapi')) {
      switch (collectionName){
        case ('rate'):
          let voteInfo:Rating = reqInfo.utils.getJsonBody(reqInfo.req);
          this.ratings = this.ratings.filter(rt => rt.employeeId !== voteInfo.employeeId || rt.formKey !== formKey || rt.role !== voteInfo.role || rt.ratingItem !== voteInfo.ratingItem);
          let rt : Rating = {formKey:formKey, employeeId:voteInfo.employeeId, role:voteInfo.role, ratingItem: voteInfo.ratingItem, rating: voteInfo.rating};
          this.ratings.push(rt);
          return reqInfo.utils.createResponse$(() => {
            const options: ResponseOptions = 
              {
                body: {msg:voteInfo.rating},
                status: STATUS.OK
              } ;
              return this.finishOptions(options, reqInfo);
          });
          break;
        case ('comment'):
          let cmInfo:Comment = reqInfo.utils.getJsonBody(reqInfo.req);
          this.comments = this.comments.filter(cm => cm.employeeId !== cmInfo.employeeId || cm.formKey !== formKey || cm.role !== cmInfo.role);
          let cm : Comment = {formKey:formKey, employeeId:cmInfo.employeeId, role:cmInfo.role, comment: cmInfo.comment};
          this.comments.push(cm);
          return reqInfo.utils.createResponse$(() => {
            const options: ResponseOptions = 
              {
                body: {msg:"added"},
                status: STATUS.OK
              } ;
              return this.finishOptions(options, reqInfo);
          });
          break;
      }
    }
    return undefined; // let the default handle all others
  }

  //http PUT interceptor
  put(reqInfo: RequestInfo) {
    const api = reqInfo.apiBase;
    const collectionName = reqInfo.collectionName

    if (api.startsWith('formapi')) {
      switch (collectionName){
        case ('bookform'):
          const formKey:string = this.bookAForm(reqInfo.id);
          return reqInfo.utils.createResponse$(() => {
            const options: ResponseOptions = formKey !== "" ?
              {
                body: {"msg":formKey},
                status: STATUS.OK
              } :
              {
                body: { error: `not found or used already` },
                status: STATUS.NOT_FOUND
              };
              return this.finishOptions(options, reqInfo);
          });
          break;
      }
    }
    return undefined; // let the default handle all others
  }

  //模拟预定一个还没有被使用过的form
  private bookAForm(formId: string):string{
    let formIdx: number = -1;
    this.forms.forEach((aform,idx) => {
      if(aform.id === formId && aform.key === ""){
        formIdx = idx;
      }
    });

    if(formIdx < 0) {
      console.log(`can't book form ${formId}`);
      return "";
    }

    console.log(`you are booking form ${formId}`);
    this.forms[formIdx].key = formId.concat("_key");
    return this.forms[formIdx].key;
  }

  /////////// helpers ///////////////
  private finishOptions(options: ResponseOptions, {headers, url}: RequestInfo) {
    options.statusText = getStatusText(options.status);
    options.headers = headers;
    options.url = url;
    return options;
  }
}
