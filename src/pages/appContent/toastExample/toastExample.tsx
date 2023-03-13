import React, { useState } from "react";
import useToast, { ToastInstanceType } from "@/hooks/useToast"

import "./toastExample.less"

interface IExample {
  label: string
  option: ToastInstanceType
}
interface IExampleList {
  title: string
  contentOptions: IExample[]
}

const exampleList: IExampleList[] = [
  {
    title: "不同类型的 Toast",
    contentOptions: [
      {
        label: "normal",
        option: {
          content: "我是普通的 toast"
        }
      },
      {
        label: "info",
        option: {
          type: "info",
          content: "我是类型为 info 的 toast"
        }
      },
      {
        label: "success",
        option: {
          type: "success",
          content: "我是类型为 success 的 toast"
        }
      },
      {
        label: "warning",
        option: {
          type: "warning",
          content: "我是类型为 warning 的 toast"
        }
      },
      {
        label: "error",
        option: {
          type: "error",
          content: "我是类型为 error 的 toast"
        }
      },
    ]
  },
  {
    title: "不同位置的 Toast",
    contentOptions: [
      {
        label: "left",
        option: {
          position: "left",
          content: "我是居左的 toast"
        }
      },
      {
        label: "center",
        option: {
          position: "center",
          content: "我是居中 的 toast"
        }
      },
      {
        label: "right",
        option: {
          position: "right",
          content: "我是居右的 toast"
        }
      },
    ]
  },
  {
    title: "可控关闭的 Toast",
    contentOptions: [
      {
        label: "auto",
        option: {
          autoClose: true,
          autoCloseDelay: 2000,
          content: "我是会自动关闭的！"
        }
      },
      {
        label: "manual",
        option: {
          autoClose: false,
          showCloseBtn: true,
          content: "我需要你手动点击关闭哦"
        }
      },
    ]
  },
]

export default function ToastExample() {

  const { showToast } = useToast()

  const handleShowClick = (op: ToastInstanceType) => {
    showToast(op)
  }


  return (
    <div className="toastExample-container">
      <div className="title">Toast 示例</div>
      {exampleList.map(v => (
        <div key={v.title} className="example-panel pl20 pr20">
          <div className="sub-title mb10">
            {v.title}
          </div>
          <div className="example-content">
            {v.contentOptions.map(c => (
              <div key={c.label} className="example-btn" onClick={() => handleShowClick(c.option)}>{c.label}</div>
            ))}
          </div>
        </div>
      ))}

    </div>
  )
}