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
//更改角色菜单权限
export function updateRoleMenu(data){
    return request({
        url:"/admin/role/updateRoleMenu",
        method:"PUT",
        data
    })
}

//新增或者修改角色
export function saveOrUpdateRole(data){
    return request({
        url:"/admin/role/saveOrUpdateRole",
        method:"POST",
        data
    })
}