import { ref, string } from "joi";
import mongoose,{Schema,Document} from "mongoose"
import Subject, { ISubject } from "./Subject";
import removeFieldsPlugin from "../removeFieldsPlugin";
import { ISubjectDetail } from "./SubjectDetail";
import { ITeacher } from './Teacher';
export interface IQuestion extends Document{
   question:string,
   option:string[],
   answer:string[],
   create_at:Date,
   subjectDetailId:mongoose.ObjectId|ISubjectDetail
   tableOfContents:string,
   isMul:Boolean,
   level:number,
   createUserId:ITeacher
}
const QuestionSchema:Schema=new Schema({
   question:{type:String,require:true},
   option:[{type:String,require:true}],
   answer:[{type:String,require:true}],
   create_at:{type:Date,default:new Date()},
   createUserId:{type:Schema.ObjectId,ref:"Teacher"},
   isMul:{type:Boolean},
   subjectDetailId:{type:Schema.ObjectId,ref:"SubjectDetail"},
   tableOfContents:{type:String,require:true},
   level:Number,
})
const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
export default Question