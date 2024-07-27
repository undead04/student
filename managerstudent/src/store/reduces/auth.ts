import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ILogin } from "../../servers/authServer";
interface AuthState{
    isLoggedIn:boolean;
    token?:string;
    refreshToken?:string,
    userInfo?:ILogin
}
const authSlice=createSlice({
    name:"auth",
    initialState:{
        isLoggedIn:false,
        toke:undefined,
        userInfo:undefined,
        refreshToken:undefined,
    }as AuthState,
    reducers:{
        login:(state,
            action:PayloadAction<{token:string,resfreshToken:string,userInfo:ILogin}>)=>{
                state.isLoggedIn=true;
                state.token=action.payload.token;
                state.userInfo=action.payload.userInfo;
                state.refreshToken=action.payload.resfreshToken;
                
            },
        logout:(state)=>{
            state.isLoggedIn=false;
            state.token=undefined;
            state.userInfo=undefined
            state.refreshToken=undefined;
        },
        refresh:(state,
            action:PayloadAction<{token:string,resfreshToken:string,userInfo:ILogin}>)=>{
                state.isLoggedIn=true;
                state.token=action.payload.token;
                state.userInfo=action.payload.userInfo;
                state.refreshToken=action.payload.resfreshToken;
                
            },
    }
});
export const {login,logout,refresh}=authSlice.actions;
const authReducer=authSlice.reducer;
export default authReducer;