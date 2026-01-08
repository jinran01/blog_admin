import {request} from "./request";
//获取文章列表
export function getTagsById(id){
    return request({
        url:"/admin/tag/29",
        params:id
    })
}