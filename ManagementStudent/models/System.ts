import mongoose, { Schema, Document } from 'mongoose';
import { ISubject } from './Subject';
import { IUser } from './User';
import { IClassRoom } from './ClassRoom';
import removeFieldsPlugin from '../removeFieldsPlugin';
import { string } from 'joi';

// Định nghĩa interface cho document Teacher
export interface ISystem extends Document {
 logo:string,
 name:string
 schoolYear:string,
 semester:string,
}

// Định nghĩa schema cho Teacher
const SystemSchema: Schema = new Schema({
  logo:{type:String},
  name:{type:String},
  semester:{type:String,require:true},
  schoolYear:{type:String}
});
 
// Định nghĩa model cho Teacher
const System = mongoose.model<ISystem>('System', SystemSchema);

export default System; // Xuất model để sử dụng trong các module khác
