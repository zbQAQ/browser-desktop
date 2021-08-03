import React from "react"

import Loading, { LOADING_TYPE } from "@/components/loadingv2/loading"

import "./cssWall.less"

export default function CssWall() {
  return (
    <div className="csswall-container">
      <Loading className="mr20" visible={true} type={LOADING_TYPE.CUBE} />
      <Loading className="mr20" visible={true} type={LOADING_TYPE.ZOOM_CIRCLE} />
      <Loading className="mr20" visible={true} type={LOADING_TYPE.MATRIX} />
      <Loading className="mr20" visible={true} type={LOADING_TYPE.GRADIENT_CIRCLE} />
      <Loading className="mr20" visible={true} type={LOADING_TYPE.SQUARE_LATTICE} />
      <Loading className="mr20" visible={true} type={LOADING_TYPE.RAINBOW_PROGRESS} />
    </div>  
  )
}