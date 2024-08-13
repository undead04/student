import { string } from "joi";
import mongoose,{Schema,Document, Mongoose} from "mongoose"
import { ISubjectDetail } from "./SubjectDetail";
import { IClassRoom } from "./ClassRoom";
import { IStudent } from "./Student";
import { ITeacher } from "./Teacher";
export interface IHomework extends Document{
   name:string,
   subjectDetailId:ISubjectDetail,
   classRoomId:|IClassRoom[],
   student:IStudent[],
   startDate:Date,
   endDate:Date,
   create_at:Date,
   questionId:string[],
   createUserId:ITeacher,
   schoolYear:string,
   semester:string,
}
const homeworkSchema:Schema=new Schema({
    name:{type:String,require:true},
    subjectDetailId:{type:Schema.ObjectId,ref:"subjectDetail"},
    classRoomId:[{type:Schema.ObjectId,ref:"ClassRoom"}],
    createUserId:{type:Schema.ObjectId,ref:"Teacher"},
    startDate:{type:Date},
    endDate:{type:Date},
    create_at:{type:Date},
    questionId:[{type:Schema.ObjectId,ref:"Question"}],
    schoolYear:{type:String},
   semester:{type:String},
})
const Homework = mongoose.model<IHomework>('Homework', homeworkSchema);
export default Homework