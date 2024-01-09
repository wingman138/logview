import request from '@/utils/request'
export const logGetListService = (params) => {
  return request.post('/LogManager/GetLogInfosOfPage', JSON.stringify(params), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
//根据id获取文章详情
export const logGetDetailService = (id) => request.get('/LogManager/GetLogData', { params: { id } })
export const logDelService = (days) => request.get('/LogManager/DelLogData', { params: { days } })
