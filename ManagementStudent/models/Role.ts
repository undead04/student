import mongoose,{Schema,Document} from "mongoose"
export interface IRole extends Document{
   name:string,
   create_at:Date
}
const RoleSchema:Schema=new Schema({
   name:{type:String,require:true},
   create_at:{type:Date,default:new Date()}
   
})
const Role = mongoose.model<IRole>('Role', RoleSchema);