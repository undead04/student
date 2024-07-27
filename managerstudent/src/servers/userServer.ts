import api from "./api";
import { IClassRoom } from "./classServer";
import ResponseWrapper from "./responseWrapper";

export interface IUser{
  _id:string,
    role:string[]
  username:string,
  password:string,
}
export interface IInfoUser{
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
const get = () => {
  return api
    .get<ResponseWrapper<IUser>>(`${api.url.user}`)
    .then((res) => res.data);
};
const userService={
  get
}
export default userService