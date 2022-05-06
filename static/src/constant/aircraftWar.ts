// AircraftWar应用 reducer操作
export enum AIRCARFT_WAR_ACTION_TYPE {
  PLAYER_MOVE_LEFT = 'player_move_left',
  PLAYER_MOVE_RIGHT = 'nplayer_move_right',
  PLAYER_MOVE_UP = 'player_move_up',
  PLAYER_MOVE_DOWN = 'player_move_down',
  PLAYER_SHOT = 'player_shot',
  // 更新边界
  UPDATE_BOUNDARY = 'update_boundary',
  // // 生成子弹 兼容到 ENEMY_SHOT ｜ PLAYER_SHOT 里
  // GENERATE_BULLET = 'generate_bullet',
  // 子弹移动
  BULLET_MOVE = 'bullet_move',
  // 标记子弹为 已销毁
  BULLET_MARK_DESTROY = 'bullet_mark_destroy',
  // 清除被标记为 已销毁 的子弹
  BULLET_CLEAN = 'bullet_clean',
  // 生成 enemy
  SPAWN_ENEMY = 'spawn_enemy',
  // enemy 移动
  ENEMY_RANDOM_MOVE = 'enemy_random_move',
  // enemy 变向
  ENEMY_CHANGE_DIRECTION = 'enemy_change_direction',
  // enemy 射击
  ENEMY_SHOT = 'enemy_shot',
  // 销毁某个enemy
  DESTORY_ENEMY = 'destoryEnemy',
  // 判断 player 和 enemy 是否重叠
  JUDGE_PLAYER_OVERLAP_ENEMY = 'judge_player_overlap_enemy',
  // 判断 bullet 和 enemy 是否重叠
  JUDGE_BULLET_OVERLAP_ENEMY = 'judge_bullet_overlap_enemy',
  // 判断 bullet 和 enemy 是否重叠
  JUDGE_BULLET_OVERLAP_PLAYER = 'judge_bullet_overlap_player',
  // 修改游戏状态
  CHANGE_GAME_STATUS = 'change_game_status',
  // 修改游戏难度等级
  CHANGE_GAME_LEVELS = 'change_game_levels',
  // 游戏重开
  GAME_RESTART = 'game_restart',
}

// 游戏难度
export enum GAME_LEVELS {
  SIMPLE = 'simple',
  MEDIUM = 'medium',
  DIFFICULEY = 'difficulty',
}

export enum GAME_STATUS {
  // 进行中
  ONLINT = "online",
  // 停止
  ABORT = "abort",
  // 通关
  CLEARANCE = "clearance",
  // 游戏结束
  OVER = "over",
}

// enemy 难度
export enum ENEMY_DIFFICULTY {
  // 障碍物 不需要变向
  OBSTACLE = "obstacle",

  NOOB = "noob",
  STRONG = "strong",
}

// 方向
export enum DIRECTION_TYPE {
  LEFT = 'left',
  UP = 'up',
  RIGHT = 'right',
  DOWN = 'down',
  LEFT_UP = 'left_up',
  LEFT_DOWN = 'left_down',
  RIGHT_UP = 'right_up',
  RIGHT_DOWN = 'right_down',
}

// 常规 boundary
export interface IBoundary {
  x: number,
  y: number,
  w: number,
  h: number
}

export interface IEnemy {
  id: string
  x: number
  y: number
  w: number
  h: number
  // 移动速度
  speed: number
  // 标记销毁
  isDestory: boolean
  // 生成时间
  ct: number
  // 移动方向
  direction: DIRECTION_TYPE
  // 难度
  difficulty: ENEMY_DIFFICULTY
}

export interface IBullet {
  id: string
  x: number
  y: number
  w: number
  h: number
  // 移动速度
  speed: number
  // 标记销毁
  isDestory: boolean
  // 生成时间
  ct: number
  // 属于哪个
  belong: IBulletBelong
}

export interface IAircraftWarContext {
  // 游戏关卡
  gameLevels: GAME_LEVELS,
  // 游戏状态
  gameStatus: GAME_STATUS,
  // 玩家宽度
  playerW: number;
  // 玩家高度
  playerH: number;
  // 玩家 坐标X
  playerX: number
  // 玩家 坐标Y
  playerY: number
  // 玩家 移动速度
  playerSpeed: number;
  // 玩家 射速 单位毫秒
  playerShotRate: number;
  // 地图边界
  gameBoundary: {
    up: number,
    right: number,
    down: number,
    left: number,
  };
  // 子弹队列
  bulletQueue: IBullet[];
  enemyQueue: IEnemy[];
  // 得分
  score: number;
  dispatch: React.Dispatch<IAnyAction<AIRCARFT_WAR_ACTION_TYPE>>
}

export type IBulletBelong = 'player' | 'enemy'

// 根据难度值 变向频率 单位毫秒ms
export const ENEMY_CHNAGE_FREQUENCY = {
  [ENEMY_DIFFICULTY.OBSTACLE]: -1,
  [ENEMY_DIFFICULTY.NOOB]: 1000,
  [ENEMY_DIFFICULTY.STRONG]: 500,
}

// 根据难度值 大小
export const ENEMY_SIZES = {
  [ENEMY_DIFFICULTY.OBSTACLE]: { w: 50, h: 50 },
  [ENEMY_DIFFICULTY.NOOB]: { w: 69, h: 99 },
  [ENEMY_DIFFICULTY.STRONG]: { w: 109, h: 167 },
}

// 根据难度值 移动速度 单位毫秒ms
export const ENEMY_SPEEDS = {
  [ENEMY_DIFFICULTY.OBSTACLE]: 4,
  [ENEMY_DIFFICULTY.NOOB]: 5,
  [ENEMY_DIFFICULTY.STRONG]: 6,
}

// 根据难度值 射击间隔 单位毫秒ms
export const ENEMY_SHOT_RATE = {
  [ENEMY_DIFFICULTY.OBSTACLE]: -1,
  [ENEMY_DIFFICULTY.NOOB]: 1000,
  [ENEMY_DIFFICULTY.STRONG]: 400,
}

export const ENEMY_SCORE_MAP = {
  [ENEMY_DIFFICULTY.OBSTACLE]: 10,
  [ENEMY_DIFFICULTY.NOOB]: 100,
  [ENEMY_DIFFICULTY.STRONG]: 500,
}

// enemy 出生点
export const ENEMY_SPAWN_POINTS = [
  { x: 0, y: 0 },
  { x: 175, y: 0 },
  { x: 220, y: 0 },
]

// 不同游戏难度下 信息枚举
export const GAME_LEVELS_INFO_MAP = {
  [GAME_LEVELS.SIMPLE] : {
    spawnRate: 1200
  },
  [GAME_LEVELS.MEDIUM] : {
    spawnRate: 1000
  },
  [GAME_LEVELS.DIFFICULEY] : {
    spawnRate: 600
  },
}
