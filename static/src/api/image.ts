import request from "@/util/request"

const CONFIG = window.CONFIG
const apiPrefix = CONFIG.apiHost + "/image"

export function uploadImag (file: any) {
  const uri = apiPrefix + "/upload"
  const config = {
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }
  return request.post(uri, file, config)
}