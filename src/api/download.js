import request from '@/api/request';
import {mixinMenu} from "@/api/menuTop";
// download
export const fileDownloadPost= data => {
  return request({
    url: `admin/school/open/file/download`,
    method: 'POST',
    data
  });
}
