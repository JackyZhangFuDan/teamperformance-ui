// //从web service返回的evaluation，用于EvaluationFormWS中
// export interface DevEvaluationWS{
//     employeeId:string;
//     employeeName:string;
//     employeeRole:string;
//     speed: number;
//     quality: number;
//     quantity: number;
//     business: number;
//     activeness: number;
//     joindiscuss: number;
//     teamwork: number;
//     cooperatewithhappyness: number;
// }
// export interface QAEvaluationWS{
//     employeeId:string;
//     employeeName:string;
//     employeeRole:string;
//     speed: number;
//     workload: number;
//     business: number;
//     activeness: number;
//     joindiscuss: number;
//     teamwork: number;
//     cooperatewithhappyness: number;
// }
// export interface SMEvaluationWS{
//     employeeId:string;
//     employeeName:string;
//     employeeRole:string;
//     speed: number;
//     workload: number;
//     scrum: number;
//     activecoordinate: number;
//     business: number;
//     joindiscuss: number;
//     teamwork: number;
//     cooperatewithhappyness: number;
// }
// export interface POEvaluationWS{
//     employeeId:string;
//     employeeName:string;
//     employeeRole:string;
//     speed: number;
//     workload: number;
//     requirement: number;
//     business: number;
//     joindiscuss: number;
//     teamwork: number;
//     cooperatewithhappyness: number;
// }

// //从web service返回的某个同事填写的一份form
// export interface EvaluationFormWS{
//     id: string;
//     internalKey: string //internal key会保留在用户cookie，使用者可以通过它来二次打开form；
//     year: string;

//     devEvaluations: DevEvaluationWS[];
//     qaEvaluations: QAEvaluationWS[];
//     smEvaluations: SMEvaluationWS[];
//     poEvaluations: POEvaluationWS[];
// }

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