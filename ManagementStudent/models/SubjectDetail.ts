import mongoose, { Schema, Document } from 'mongoose';
import { ISubject } from './Subject';
import removeFieldsPlugin from '../removeFieldsPlugin';
import { string } from 'joi';
// Định nghĩa interface cho document Subject
export interface ISubjectDetail extends Document {
  subjectId:mongoose.Types.ObjectId|ISubject,
  grade:number,
  tableOfContents:string[],
  image:string
}

// Định nghĩa schema cho Subject
const SubjectDetailSchema: Schema = new Schema({
    subjectId:{type:Schema.Types.ObjectId,ref:"Subject"},
    grade:{type:Number,require:true},
    tableOfContents:[{type:String,require:true}],
    image:{type:String}
});
// Định nghĩa virtual
SubjectDetailSchema.virtual('subject', {
  ref: 'Subject',
  localField: 'subjectId',
  foreignField: '_id',
  justOne: true // Chỉ lấy một document từ collection Subject
});
SubjectDetailSchema.set('id', false);
// Bao gồm virtual fields trong output JSON và Object
SubjectDetailSchema.set('toJSON', { virtuals: true });
// Sử dụng plugin để loại bỏ các trường không cần thiết
SubjectDetailSchema.plugin(removeFieldsPlugin, ['subjectId']);
const SubjectDetail = mongoose.model<ISubjectDetail>('SubjectDetail', SubjectDetailSchema)
export default SubjectDetail; // Xuất model để sử dụng trong các module khác
