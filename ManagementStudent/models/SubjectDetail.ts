import mongoose, { Schema, Document } from 'mongoose';
import { ISubject } from './Subject';
import removeFieldsPlugin from '../removeFieldsPlugin';
import { string } from 'joi';
// Định nghĩa interface cho document Subject
export interface ISubjectDetail extends Document {
  subjectId:ISubject,
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
const SubjectDetail = mongoose.model<ISubjectDetail>('SubjectDetail', SubjectDetailSchema)
export default SubjectDetail; // Xuất model để sử dụng trong các module khác
