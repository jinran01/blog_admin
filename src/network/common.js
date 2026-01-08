import {request} from "./request";
//用户登录login
export function sendPhoneCode(phone){
    return request({
        url:"/common/phone/code",
        method:"POST",
        params:{phone},
        noToken: true
    })
}

export function sendEamilCode(email){
    return request({
        url:"/common/email/code",
        method:"POST",
        params:{email},
        noToken: true
    })
}