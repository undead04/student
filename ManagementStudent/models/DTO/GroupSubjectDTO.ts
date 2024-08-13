
import { ISubject } from "../Subject"
export interface IDetail{
    _id:string,
    grade:number,
    subjectId:ISubject
}
export interface GroupSubjectDTO{
    subject:ISubject,
    details:IDetail[]
}