import request from '@/utils/request'
//区域api
export const regionGetService = () => request.get('/LogManager/GetRegions')
export const branchGetService = (id) => request.get('/LogManager/GetBranchs', { params: { regionId: id } })
//优先级api
export const priorityGetService = (id) => request.get('/LogManager/GetPriorities', { params: { branchId: id } })
export const priorityDelService = (data) => request.post('/LogManager/delPriority', data)
export const priorityEditService = (data) => request.post('/LogManager/editPriority', data)
//号票api
export const ticketGetService = (id) => request.get('/LogManager/GetTickets', { params: { branchId: id } })
export const ticketDelService = (data) => request.post('/LogManager/delTicket', data)
export const ticketGhostService = (data) => request.post('/LogManager/ghostTicket', data)
export const ticketEditService = (data) => request.post('/LogManager/editTicket', data)

//图片api
export const picGetService = (branchId, picName, pictype) =>
  request.get('/LogManager/ReadPicFromDb', { params: { picname: picName, pictype: pictype, branchId: branchId } })
// export const picAllService = (branchId, pictype) => request.get('/LogManager/ReadPicFromDb', { params: { pictype: pictype, branchId: branchId } })
//触摸屏界面api
export const printerGetService = (id) => request.get('/LogManager/getPrinters', { params: { branchId: id } })
export const pageGetService = (branchId, printer) =>
  request.get('/LogManager/getPageOfPrinters', { params: { branchId: branchId, printer: printer } })
