import mongoose, { Schema, Document } from 'mongoose';
import { IRole } from './Role';

// Định nghĩa interface cho document Teacher
export interface IUser extends Document {
  role:string[]
  username:string,
  password:string,
  avatar:string,
}
// Định nghĩa schema cho Teacher
const UserSchema: Schema = new Schema({
    role: [{type:String}],
    username:{type:String,require:true},
    password:{type:String,require:true},
    avatar:{type:String,require:true},
});

// Định nghĩa model cho Teacher
const User = mongoose.model<IUser>('User', UserSchema);

export default User; // Xuất model để sử dụng trong các module khác
