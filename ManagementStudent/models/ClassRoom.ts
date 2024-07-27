import mongoose,{Schema,Document} from "mongoose"
export interface IClassRoom extends Document{
   
   name:string,
   grade:number,
}
const ClassRoomSchema:Schema=new Schema({
   name:{type:String,require:true},
   grade:{type:Number,require:true},
   homeroomTeacher:{type:Schema.Types.ObjectId,ref:"Teacher",default:null}
   
})
const ClassRoom = mongoose.model<IClassRoom>('ClassRoom', ClassRoomSchema);
export default ClassRoom