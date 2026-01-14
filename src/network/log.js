import {request} from "./request";
//用户登录login
export function getOperationLog(data){
    return request({
        url:"/admin/log/all",
        method:"GET",
        params:{...data}
    })
}