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
    id: 2,
    key: "chess",
    name: "象棋",
    iconType: "svg",
    iconName: "iconyouxiyouxiqipai",
    showType: "dialog",
  },
  {
    id: 3,
    key: "ticTacToe",
    name: "井字棋",
    iconType: "svg",
    iconName: "iconjingziqi",
    showType: "dialog",
  },
]

export const appContentMap: IAppContentMap[] = [
  {
    key: "search",
    dialogStyle: ["fullScreen"],
    renderComponents: asyncComponent(() => import("@/pages/appContent/search/search"))
  },
  {
    key: "chess",
    dialogStyle: ["fullScreen", "darkBackground"],
    renderComponents: asyncComponent(() => import("@/pages/appContent/chess/chess"))
  },
  {
    key: "ticTacToe",
    dialogStyle: ["floatWindow", "floatCenter", "garyBackground"],
    renderComponents: asyncComponent(() => import("@/pages/appContent/ticTacToe/ticTacToe"))
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
      return C ? <C /> : <></>;
    }
  }

  return AsyncComponent
}

