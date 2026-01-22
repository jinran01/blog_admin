import {request} from "./request";
// 获取用户菜单树
export function getMenuTree(){
    return request({
        url:"/admin/menu/usermenu",
        method:"GET",
    })
}
// 获取所有菜单树
export function getAllMenuTree(){
    return request({
        url:"/admin/menu/all",
        method:"GET",
    })
}
// 获取角色菜单ids
export function getMenuIdsByRoleId(roleId){
    return request({
        url:`/admin/menu/${roleId}`,
        method:"GET",
    })
}

// 新增或者更新菜单
export function saveOrUpdate(data){
    return request({
        url:`/admin/menu/saveOrUpdate`,
        method:"POST",
        data
    })
}