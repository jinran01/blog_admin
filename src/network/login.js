import {request} from "./request";
//用户登录login
export function loginByUsername(username,password){
    return request({
        url:"/admin/auth/login",
        method:"POST",
        params:{username:username,password:password},
        noToken: true
    })
}