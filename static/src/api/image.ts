import request from "@/util/request"

const CONFIG = window.CONFIG
const apiPrefix = CONFIG.apiHost + "/image"

export function uploadImag (formdata: FormData) {
  const uri = apiPrefix + "/upload"
  const config = {
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
  }
  return request.post(uri, formdata, config)
}

export function getWallpaperThumb () {
  const uri = apiPrefix + "/list/thumbnail"
  return request.get(uri)
}