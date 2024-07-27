import mongoose, { Schema, Document } from 'mongoose';
import { ISubject } from './Subject';
import { IUser } from './User';
import { IClassRoom } from './ClassRoom';
import removeFieldsPlugin from '../removeFieldsPlugin';
import { number } from 'joi';

// Định nghĩa interface cho document Teacher
export interface ITeacher extends Document {
  codeUser: string;
  name: string;
  subjectId: mongoose.Types.ObjectId[] | ISubject[]; // Kiểu dữ liệu cho subjectId
  userId:mongoose.Types.ObjectId|IUser;
  email: string;
  dateOfBirth: Date;
  cccd: string;
  phone: string;
  address: string;
  create_at: Date;
  status:boolean,
  sex:number
}

// Định nghĩa schema cho Teacher
const TeacherSchema: Schema = new Schema({
  codeUser: { type: String, required: true },
  name: { type: String, required: true },
  subjectId: [{ type: Schema.Types.ObjectId, ref: 'Subject' }], // Tham chiếu đến Subject bằng ref
  userId:{type:Schema.Types.ObjectId,ref:"User"},
  email: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  cccd: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  create_at: { type: Date, default: Date.now },
  
  status:{type:Boolean,default:true},
  sex:{type:Number}
});
  TeacherSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true // Chỉ lấy một document từ collection Subject
  });
  TeacherSchema.virtual('subject', {
    ref: 'Subject',
    localField: 'subjectId',
    foreignField: '_id',
    });
  TeacherSchema.set('id', false);
  // Bao gồm virtual fields trong output JSON và Object
  TeacherSchema.set('toJSON', { virtuals: true });
  // Sử dụng plugin để loại bỏ các trường không cần thiết
  TeacherSchema.plugin(removeFieldsPlugin, ['userId']);
  TeacherSchema.plugin(removeFieldsPlugin, ['subjectId']);
// Định nghĩa model cho Teacher
const Teacher = mongoose.model<ITeacher>('Teacher', TeacherSchema);

export default Teacher; // Xuất model để sử dụng trong các module khác
