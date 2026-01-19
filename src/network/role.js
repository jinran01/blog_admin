import {request} from "./request";
//获取角色列表
export function getRoles(data){
    return request({
        url:"/admin/role/list",
        params:{...data}
    })
}

//更改角色禁用状态
export function updateRoleStatus(data){
    return request({
        url:"/admin/role/updateStatus",
        method:"PUT",
        data
    })
}