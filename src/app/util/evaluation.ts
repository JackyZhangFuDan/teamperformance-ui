// //从web service返回的evaluation，用于EvaluationFormWS中
export interface Form{
    id:string;
    key:string;
    year:number;
}

export interface Employee{
    id:string;
    role:string; //dev,qa,sm,po,ux
    name:string;
    status:number; //0:inactive; 1:active
}

export interface Rating{
    formKey:string;
    employeeId:string;
    role:string;
    ratingItem:string;
    rating:number;
}

export interface Comment{
    formKey:string;
    employeeId:string;
    role:string;
    comment:string;
}

export interface RatingCount{
    ratingItem:string; 
    rating:number;
    count:number;
}

export interface MyRating{
    employeeId:string;
    employeeName:string;
    employeeRole:string;
    ratingCounts:RatingCount[];
    comments:string[];
}

export interface RatingAverage{
    year:number;
    role:string;
    item:string;
    average:number;
}

//用于程序内部使用的evaluation
export interface DevEvaluation{
    employeeId:string;
    employeeName:string;
    employeeRole:string;
    speed: number;
    quality: number;
    quantity: number;
    business: number;
    activeness: number;
    joindiscuss: number;
    teamwork: number;
    cooperatewithhappyness: number;

    comment:string;
    expend:boolean;
}
export interface QAEvaluation{
    employeeId:string;
    employeeName:string;
    employeeRole:string;
    speed: number;
    workload: number;
    business: number;
    activeness: number;
    joindiscuss: number;
    teamwork: number;
    cooperatewithhappyness: number;

    comment:string;
    expend:boolean;
}
export interface SMEvaluation{
    employeeId:string;
    employeeName:string;
    employeeRole:string;
    speed: number;
    workload: number;
    scrum: number;
    activecoordinate: number;
    business: number;
    joindiscuss: number;
    teamwork: number;
    cooperatewithhappyness: number;

    comment:string;
    expend:boolean;
}
export interface POEvaluation{
    employeeId:string;
    employeeName:string;
    employeeRole:string;
    speed: number;
    workload: number;
    requirement: number;
    business: number;
    joindiscuss: number;
    teamwork: number;
    cooperatewithhappyness: number;

    comment:string;
    expend:boolean;
}