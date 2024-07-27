import { string } from "joi";
import mongoose,{Schema,Document, Mongoose} from "mongoose"
import { ISubjectDetail } from "./SubjectDetail";
import { IClassRoom } from "./ClassRoom";
export interface ILesson extends Document{
   name:string,
   subjectDetail:mongoose.ObjectId|ISubjectDetail,
   classRoomId:mongoose.ObjectId|IClassRoom,
   file:string,
   create_at:Date
}
const LessonSchema:Schema=new Schema({
   name:{type:String,require:true},
   subjectDetail:{type:Schema.ObjectId,ref:"SubjectDetail"},
   classRoomId:{type:Schema.ObjectId,ref:'ClassRoom'},
   file:{type:string},
   create_at:{type:Date,default:new Date()}
})
const ClassRoom = mongoose.model<ILesson>('Lesson', LessonSchema);
export default ClassRoom