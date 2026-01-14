import {request} from "./request";
//获取角色列表
export function getRoles(data){
    return request({
        url:"/admin/role/list",
        params:{...data}
    })
}