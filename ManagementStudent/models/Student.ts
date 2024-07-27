import mongoose, { Schema, Document } from 'mongoose';
import { IClassRoom } from './ClassRoom';
import { IUser } from './User';
import removeFieldsPlugin from '../removeFieldsPlugin';
import { number } from 'joi';
// Định nghĩa interface cho document Teacher
export interface IStudent extends Document {
  _id:string,
  codeUser: string;
  name: string;
  email: string;
  dateOfBirth: Date;
  cccd: string;
  phone: string;
  address: string;
  create_at: Date;
  classRoomId:IClassRoom,
  userId:IUser
  status:boolean,
  sex:number
}

// Định nghĩa schema cho Teacher
const StudentSchema: Schema = new Schema({
  codeUser: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  classRoomId:{type:Schema.Types.ObjectId,ref:"ClassRoom"},
  userId:{type:Schema.Types.ObjectId,ref:"User"},
  cccd: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  create_at: { type: Date, default: Date.now },
  status:{type:Boolean,default:true},
  sex:{type:Number}
});
// Định nghĩa model cho Teacher
const Student = mongoose.model<IStudent>('Student', StudentSchema);

export default Student; // Xuất model để sử dụng trong các module khác
