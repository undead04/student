
import mongoose,{Schema,Document, Mongoose} from "mongoose"
import { IClassRoom } from './ClassRoom';
import { IQuestion } from './Questions';
import { ISubjectDetail } from "./SubjectDetail";
import { ref } from "joi";
import { IStudent } from './Student';
export interface IExam extends Document{
   _id:string,
   name:string,
   subjectDetailId:ISubjectDetail
   classRoomId:IClassRoom[],
   startDate:Date,
   endDate:Date,
   create_at:Date,
   questionId:IQuestion[]
   answerDate:Date,
   studentId:IStudent[],
   createUserId:mongoose.ObjectId
}
const ExamSchema:Schema=new Schema({
   name:{type:String,require:true},
   subjectDetailId:{type:Schema.ObjectId,ref:"subjectDetail"},
   classRoomId:[{type:Schema.ObjectId,ref:"ClassRoom"}],
   startDate:{type:Date},
   endDate:{type:Date},
   answerDate:{type:Date},
   create_at:{type:Date},
   questionId:[{type:Schema.ObjectId,ref:"Question"}],
   studentId:[{type:Schema.ObjectId,ref:"Student"}],
   createUserId:{type:Schema.ObjectId,ref:"Teacher"}
   
})
const Exam = mongoose.model<IExam>('Exam', ExamSchema);
export default Exam