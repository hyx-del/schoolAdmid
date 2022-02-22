import request from "./request";

// 通过ID查询字典信息
export const schoolDict = data => {
  return request({
    url: `/admin/school/dict`,
    method: "GET",
    data
  });
};

// 添加字典
export const schoolDictPost = data => {
  return request({
    url: `/admin/school/dict`,
    method: "POST",
    data
  });
};

// 修改字典
export const schoolDictPut = data => {
  return request({
    url: `/admin/school/dict`,
    method: "PUT",
    data
  });
};

// 删除字典，并且清除字典缓存
export const schoolDictDelete = data => {
  return request({
    url: `/admin/school/dict`,
    method: "DELETE",
    data
  });
};

// 通过id查询字典项
export const dictItem = data => {
  return request({
    url: `/admin/school/dict/item`,
    method: "GET",
    data
  });
};

// 新增字典项
export const dictItemPost = data => {
  return request({
    url: `/admin/school/dict/item`,
    method: "POST",
    data
  });
};

// 修改字典项
export const dictItemPut = data => {
  return request({
    url: `/admin/school/dict/item`,
    method: "PUT",
    data
  });
};

// 通过id删除字典项
export const dictItemDelete = data => {
  return request({
    url: `/admin/school/dict/item`,
    method: "DELETE",
    data
  });
};

// 分页查询字典项
export const itemList = data => {
  return request({
    url: `/admin/school/dict/item/list`,
    method: "GET",
    data
  });
};

// 修改状态
export const itemStatusPut = data => {
  return request({
    url: `/admin/school/dict/item/status`,
    method: "PUT",
    data
  });
};

// 分页查询字典信息
export const dictList = data => {
  return request({
    url: `/admin/school/dict/list`,
    method: "GET",
    data
  });
};

// 通过类型查询字典 缓存
export const dictType = data => {
  return request({
    url: `/admin/school/dict/type`,
    method: "GET",
    data
  });
};
