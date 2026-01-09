import {request} from "./request";
// 获取菜单树
export function getMenuTree(){
    return request({
        url:"/admin/menu/usermenu",
        method:"GET",
    })
}