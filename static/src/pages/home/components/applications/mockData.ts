
interface IMockFace {
  id: number;
  key: string;
  name: string;
  iconType: string;
  iconName: string;
}


const mockData: IMockFace[] = [
  {
    id: 1,
    key: "Search",
    name: "搜索",
    iconType: "svg",
    iconName: "iconsearch"
  },
  {
    id: 2,
    key: "Chess",
    name: "象棋",
    iconType: "svg",
    iconName: "iconyouxiyouxiqipai"
  },
  {
    id: 3,
    key: "TicTacToe",
    name: "井字棋",
    iconType: "svg",
    iconName: "iconjingziqi"
  },
]

export default mockData