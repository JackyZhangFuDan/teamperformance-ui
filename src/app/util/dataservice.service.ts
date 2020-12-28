import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Form, Employee, Rating, Comment} from './evaluation';

const cudOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

const serviceHost = window.location.protocol + "//" + window.location.hostname + ":8080";

@Injectable({
  providedIn: 'root'
})
export class DataserviceService {

  constructor(private http: HttpClient) { }

  async bookFormPromise(formId: string) : Promise<string>{
    return await new Promise<string> ( (resolve) => {
      this.http.get<string>(serviceHost + `/formapi/bookform/${formId}`).subscribe( (formKey:string) => {
        resolve(formKey);
      } );
    });
  }

  bookFormObserve(formId: string) : Observable<string>{
    return this.http.put<string>(serviceHost + `/formapi/bookform/${formId}`,null);
  }
  
  //下载一个form的数据
  readForm(formKey:string) : Observable<{form:Form; employees:Employee[]; ratings:Rating[]}>{
    return this.http.get<{form:Form; employees:Employee[]; ratings:Rating[]}>(serviceHost + `/formapi/form/${formKey}`);
  }

  //下载所有的form主数据，不包含evaluation
  readAvailableFormHeaders() : Observable<Form[]>{
    return this.http.get<Form[]>(serviceHost + '/formapi/forms');
  }

  //为某一项投票
  rate(formKey:string, employeeId:string, employeeRole:string, item:string,rating:number):Observable<string>{
    let body : Rating = {formKey: formKey, employeeId:employeeId, role: employeeRole, ratingItem:item, rating:rating};
    return this.http.post<string>(serviceHost + `/formapi/rate/${formKey}`, body, cudOptions);
  }

  //为某人写评语
  comment(formKey:string, employeeId:string, employeeRole:string, comments:string):Observable<string>{
    let body : Comment = {formKey: formKey, employeeId:employeeId, role: employeeRole, comment: comments};
    return this.http.post<string>(serviceHost + `/formapi/comment/${formKey}`, body, cudOptions);
  }
}
