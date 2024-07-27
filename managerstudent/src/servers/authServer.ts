
import api from './api';
import ResponseWrapper from './responseWrapper';
export interface ILogin {
    accessToken:string;
    refreshToken:string;
    user:{
      name:string,
      avatart:string,
      role:string[]
    }
}
export interface ILoginModel{
    username: string, 
    password: string
}
export interface IRegisterModel{
    username:string,
    password:string,
    confirmPassword:string,
}
const login = (data: ILoginModel) => {
    return api
      .post<ResponseWrapper<ILogin>>(`${api.url.auth}/login`, data)
      .then((res) => res.data);
  };
const register=(id:string,data:IRegisterModel)=>{
    return api.put<ResponseWrapper<string>>(`${api.url.auth}/register/${id}`,data)
}
const refresh=(data:string)=>{
  return api.post<ResponseWrapper<ILogin>>(`${api.url.auth}/token`,data).then(res=>res.data)
}
const authService={
    login,
    register,
    refresh
}
export default authService
  
