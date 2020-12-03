
export interface IMockFace {
  id: number;
  key: string;
  name: string;
  iconType: string;
  iconName: string;
  showType: 'dialog' |  'newPage';
  pagePath?: string;
}


const mockData: IMockFace[] = [
  {
    id: 1,
    key: "Search",
    name: "搜索",
    iconType: "svg",
    iconName: "iconsearch",
    showType: "newPage",
    pagePath: "/search"
  },
  {
    id: 2,
    key: "Chess",
    name: "象棋",
    iconType: "svg",
    iconName: "iconyouxiyouxiqipai",
    showType: "dialog",
  },
  {
    id: 3,
    key: "TicTacToe",
    name: "井字棋",
    iconType: "svg",
    iconName: "iconjingziqi",
    showType: "dialog",
  },
]

export default mockData