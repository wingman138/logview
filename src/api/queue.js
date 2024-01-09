import request from '@/utils/request'
export const regionGetService = () => request.get('/LogManager/GetRegions')
export const branchGetService = (id) =>
  request.get('/LogManager/GetBranchs', { params: { regionId: id } })
