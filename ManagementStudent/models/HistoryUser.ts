import mongoose, { Schema, Document } from 'mongoose';
import { ISubject } from './Subject';
import { IUser } from './User';
import { IClassRoom } from './ClassRoom';
import removeFieldsPlugin from '../removeFieldsPlugin';
import { date, string } from 'joi';
import { IStudent } from './Student';

// Định nghĩa interface cho document Teacher
export interface IHistoryUser extends Document {
 userId:mongoose.ObjectId|IStudent,
 classRoomId:mongoose.ObjectId|IClassRoom,
 schoolYear:string,
 create_at:Date
}

// Định nghĩa schema cho Teacher
const HistorySchema: Schema = new Schema({
  userId:{type:Schema.ObjectId,ref:"Student"},
  classRoomId:{type:Schema.ObjectId,ref:'classRoom'},
  schoolYear:{type:String,require:true},
  create_at:{type:Date,default:new Date()}
});
HistorySchema.virtual("classRoom",{
    ref:"ClassRoom",
    localField:"classRoomId",
    foreignField:"_id",
    justOne:true
})
HistorySchema.virtual("user",{
    ref:"Student",
    localField:"userId",
    foreignField:"_id",
    justOne:true
})
HistorySchema.set("id",false)
HistorySchema.set('toJSON', { virtuals: true });
HistorySchema.plugin(removeFieldsPlugin,["classRoomId","userId"])
// Định nghĩa model cho Teacher
const HistoryUser = mongoose.model<IHistoryUser>('HistoryUser', HistorySchema);

export default HistoryUser; // Xuất model để sử dụng trong các module khác
