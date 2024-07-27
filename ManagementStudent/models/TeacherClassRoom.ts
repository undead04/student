import mongoose, { Schema, Document } from 'mongoose';
import { IClassRoom } from './ClassRoom';
import { ITeacher } from './Teacher';
import removeFieldsPlugin from '../removeFieldsPlugin';
import { ISubjectDetail } from './SubjectDetail';
// Định nghĩa interface cho document Subject
export interface ITeacherClassRoom extends Document {
 classRoomId:mongoose.Types.ObjectId|IClassRoom,
 teacherId:mongoose.Types.ObjectId|ITeacher,
 subjectDetailId:mongoose.Types.ObjectId|ISubjectDetail
}
// Định nghĩa schema cho Subject
const TeacherClassRoomSchema: Schema = new Schema({
  classRoomId:{type:Schema.Types.ObjectId,ref:"ClassRoom"},
  teacherId:{type:Schema.Types.ObjectId,ref:"Teacher"},
  subjectDetailId:{type:Schema.Types.ObjectId,ref:"SubjectDetail"},
});
   
// Định nghĩa model cho Subject
const TeacherClassRoom = mongoose.model<ITeacherClassRoom>('TeacherClassRoom', TeacherClassRoomSchema);
export default TeacherClassRoom; // Xuất model để sử dụng trong các module khác
