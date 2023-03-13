import request from "@/util/request"

const CONFIG = window.CONFIG
const apiPrefix = CONFIG.apiHost + "/todo"

export function getTodoList () {
  const uri = apiPrefix + "/list"
  return request.get(uri)
}

export function addTotoList (content: string) {
  const uri = apiPrefix + "/add"
  return request.post(uri, { content })
}

export function deleteTodoList (id: string) {
  const uri = apiPrefix + "/delete?id=" + id
  return request.get(uri)
}

export function updateTodoStatus (id: string, status: boolean) {
  const uri = apiPrefix + "/update"
  return request.post(uri, { id, status: status ? 1 : 0 })
}