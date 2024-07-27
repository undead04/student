import mongoose, { Schema, Document } from 'mongoose';
import { ISubjectDetail } from './SubjectDetail';

// Định nghĩa interface cho document Subject
export interface ISubject extends Document {
  name: string;
  create_at: Date;
  _id: mongoose.Types.ObjectId;
  
}
// Định nghĩa schema cho Subject
const SubjectSchema: Schema = new Schema({
  name: { type: String, required: true },
  create_at: { type: Date, default: Date.now }
});

// Định nghĩa model cho Subject
const Subject = mongoose.model<ISubject>('Subject', SubjectSchema);
export default Subject; // Xuất model để sử dụng trong các module khác
