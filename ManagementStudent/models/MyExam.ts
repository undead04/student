
import { date, number, ref, string } from "joi";
import mongoose,{Schema,Document, mongo} from "mongoose"
import { IExam } from "./Exam";
import { IStudent } from './Student';
import { IQuestion } from "./Questions";
export interface IMyExam extends Document{
   examId:IExam,
   userId:IStudent,
   create_at:Date,
   answers: {
      questionId:  IQuestion;
      answer: string[];
    }[],
   note:string,
   status:boolean,
}
const MyExamSchema:Schema=new Schema({
   examId:{type:Schema.ObjectId,ref:"Exam"},
   userId:{type:Schema.ObjectId,ref:"Student"},
   create_at:{type:Date,default:new Date()},
   answers: [
      {
        questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
        answer: [{ type: String, required: true }],
      },
    ],
   status:{type:Boolean,default:false},
   note:{type:String},
})
const MyExam = mongoose.model<IMyExam>('MyExam', MyExamSchema);
export default MyExam