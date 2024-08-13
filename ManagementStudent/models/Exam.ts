
import mongoose,{Schema,Document, Mongoose} from "mongoose"
import { IClassRoom } from './ClassRoom';
import { IQuestion } from './Questions';
import { ISubjectDetail } from "./SubjectDetail";
import { ref, string } from "joi";
import { IStudent } from './Student';
import { ITeacher } from "./Teacher";
export interface IExam extends Document{
   name:string,
   subjectDetailId:ISubjectDetail
   classRoomId:IClassRoom[],
   startDate:Date,
   endDate:Date,
   create_at:Date,
   schoolYear:string,
   semester:string,
   questionId:IQuestion[]
   answerDate:Date,
   createUserId:ITeacher,
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
   createUserId:{type:Schema.ObjectId,ref:"Teacher"},
   schoolYear:{type:String},
   semester:{type:String},
   
})
const Exam = mongoose.model<IExam>('Exam', ExamSchema);
export default Exam