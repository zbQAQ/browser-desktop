import React from 'react';

export const desktopApp: IDesktopAppType[] = [
  {
    id: 1,
    key: "search",
    name: "搜索",
    iconType: "svg",
    iconName: "iconsearch",
    showType: "dialog",
    pagePath: "/search"
  },
  {
    id: 4,
    key: "todo_list",
    name: "todo",
    iconType: "svg",
    iconName: "icontodo-line",
    showType: "dialog",
  },
  {
    id: 3,
    key: "tic_tac_toe",
    name: "井字棋",
    iconType: "svg",
    iconName: "iconjingziqi",
    showType: "dialog",
  },
  {
    id: 5,
    key: "huarong_road",
    name: "华容道仓库",
    iconType: "svg",
    iconName: "iconline-dragmovetuozhuai-01",
    showType: "dialog",
  },
  {
    id: 6,
    key: "waterfall_layout",
    name: "瀑布流布局",
    iconType: "svg",
    iconName: "iconpubuliu",
    showType: "dialog",
  },
  {
    id: 7,
    key: "wallpaper_selector",
    name: "更换壁纸",
    iconType: "svg",
    iconName: "icontupianbizhi",
    showType: "dialog",
  },
  {
    id: 8,
    key: "toast_example",
    name: "toast弹窗",
    iconType: "svg",
    iconName: "icontupianbizhi",
    showType: "dialog",
  },
]

export const appContentMap: IAppContentMap[] = [
  {
    key: "search",
    dialogStyle: ["fullScreen", "darkBackground"],
    renderComponents: asyncComponent(() => import("@/pages/appContent/search/search"))
  },
  {
    key: "chess",
    dialogStyle: ["fullScreen", "darkBackground"],
    renderComponents: asyncComponent(() => import("@/pages/appContent/chess/chess"))
  },
  {
    key: "tic_tac_toe",
    dialogStyle: ["floatWindow", "floatCenter", "garyBackground"],
    renderComponents: asyncComponent(() => import("@/pages/appContent/ticTacToe/ticTacToe"))
  },
  {
    key: "todo_list",
    dialogStyle: ["fullScreen", "darkBackground"],
    renderComponents: asyncComponent(() => import("@/pages/appContent/todoList/todoList"))
  },
  {
    key: "huarong_road",
    dialogStyle: ["fullScreen", "darkBackground"],
    renderComponents: asyncComponent(() => import("@/pages/appContent/huarongRoad/huarongRoad"))
  },
  {
    key: "waterfall_layout",
    dialogStyle: ["fullScreen", "darkBackground"],
    renderComponents: asyncComponent(() => import("@/pages/appContent/waterfall/waterfall"))
  },
  {
    key: "wallpaper_selector",
    dialogStyle: ["floatWindow", "whiteShadow", "floatCenter", "w650px", "h650px", "fontBlack"],
    renderComponents: asyncComponent(() => import("@/pages/appContent/wallpaperSelector/wallpaperSelector"))
  },
  {
    key: "toast_example",
    dialogStyle: ["floatWindow", "floatCenter", "w650px", "h650px", "fontBlack"],
    renderComponents: asyncComponent(() => import("@/pages/appContent/toastExample/toastExample"))
  },
]

function asyncComponent(importComponent: () => Promise<any>) {
  class AsyncComponent extends React.Component<any, any> {
    constructor(props: any) {
      super(props);
      this.state = {
        component: undefined,
      };
    }
    async componentDidMount() {
      const component = await importComponent();
      this.setState({component: component.default})
    }

    render() {
      const C = this.state.component;
      return C ? <C {...this.props}/> : <></>;
    }
  }

  return AsyncComponent
}

