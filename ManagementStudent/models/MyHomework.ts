
import { date, number, ref, string } from "joi";
import mongoose,{Schema,Document, mongo} from "mongoose"
import { IExam } from "./Exam";
import { IStudent } from './Student';
import { IQuestion } from "./Questions";
import { IHomework } from "./homework";
import removeFieldsPlugin from "../removeFieldsPlugin";
export interface IMyHomework extends Document{
  homeworkId:mongoose.Schema.Types.ObjectId|IHomework,
   userId:mongoose.Schema.Types.ObjectId|IStudent,
   create_at:Date,
   answers: {
      questionId: mongoose.Schema.Types.ObjectId | IQuestion;
      answer: string[];
    }[],
    status:boolean
   
}
const MyHomeworkSchema:Schema=new Schema({
   homeworkId:{type:Schema.ObjectId,ref:"Homework"},
   userId:{type:Schema.ObjectId,ref:"Student"},
   create_at:{type:Date,default:new Date()},
   answers: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
        answer: [{ type: String, required: true }],
      },
    ],
    status:{type:Boolean,default:false}
   
})
const MyHomework = mongoose.model<IMyHomework>('MyHomework', MyHomeworkSchema);
export default MyHomework