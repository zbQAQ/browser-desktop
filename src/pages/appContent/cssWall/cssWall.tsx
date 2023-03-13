import React from "react"

import Loading, { LOADING_TYPE } from "@/components/loadingv2/loading"

import "./cssWall.less"

interface ILoadingItem {
  type: LOADING_TYPE
}

export default function CssWall() {

  const loadingList: ILoadingItem[] = [
    { type: LOADING_TYPE.CUBE },
    { type: LOADING_TYPE.ZOOM_CIRCLE },
    { type: LOADING_TYPE.MATRIX },
    { type: LOADING_TYPE.GRADIENT_CIRCLE },
    { type: LOADING_TYPE.SQUARE_LATTICE },
    { type: LOADING_TYPE.RAINBOW_PROGRESS },
    { type: LOADING_TYPE.BLOCK_MOVE },
    { type: LOADING_TYPE.POINT_BOUNCE },
    { type: LOADING_TYPE.GOOEY_POINT },
    { type: LOADING_TYPE.BLOCK_WALK },
    { type: LOADING_TYPE.BLUR_FONT },
  ]

  return (
    <div className="csswall-container textCenter">
      <p className="title">Loading example</p>
      <div className="show-dialog">
        {loadingList.map( ( { type }, index ) => 
          <Loading key={index} className="sItem mr20 ml20" visible={true} type={type} />
        )}
      </div>
    </div>  
  )
}