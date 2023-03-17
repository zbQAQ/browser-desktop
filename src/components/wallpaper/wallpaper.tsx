import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

// import TransitionGroup from '@/components/transitionGroup';
import { AppInfoContext } from '@/context/appInfoProvider';

import './wallpaper.less';
interface IProps {
  isBlur: boolean;
}

// enum LOAD_STATUS {
//   READY = 'ready',
//   LOADING = 'loading',
//   END = 'end',
// }

function getPixelColor(context: any, x: number, y: number) {
  let imageData = context.getImageData(x, y, 1, 1);
  let pixel = imageData.data;
  let r = pixel[0];
  let g = pixel[1];
  let b = pixel[2];
  let a = pixel[3] / 255;
  a = Math.round(a * 100) / 100;
  return {
    rgba: 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')',
    r: r,
    g: g,
    b: b,
    a: a,
  };
}

// const reducer = (state: IAppInfoContext, action: IAction ) => {
//   const { payload } = action
//   switch(action.type) {
//     case APP_ACTION_TYPE.UPDATE_APP:
//       return { ...state, appKey: payload.appKey }
//     case APP_ACTION_TYPE.CLEAR_APP:
//       return { ...state, appKey: '' }
//     case APP_ACTION_TYPE.UPDATE_WALLPAPER:
//       return { ...state, wallpaper: payload.wallpaper }
//     default:
//       return state
//   }
// }

export default function Wallpaper(props: IProps) {
  const { isBlur } = props;
  const { wallpaper } = useContext(AppInfoContext);
  const [loadStatus, setLoadStatus] = useState(false);
  const canvasMain = useRef(null) as any;

  const imageLoader = useCallback(
    (url) => {
      return new Promise((resolve, reject) => {
        const imageDom = new Image();
        // TODO: 需要优化这里wallpaper会加载两次的问题
        imageDom.onload = () => {
          const canvasDom = canvasMain.current;
          const context = canvasDom.getContext('2d');
          context.drawImage(imageDom, 0, 0);
          const { rgba } = getPixelColor(context, 1, 1);
          document.body.style.backgroundColor = rgba;
          resolve(undefined);
        };
        imageDom.onerror = () => {
          reject();
        };
        imageDom.crossOrigin = 'anonymous';
        imageDom.src = url;
      });
    },
    [canvasMain]
  );

  // useEffect(() => {
  //   setLoadStatus(false);
  //   imageLoader('/assets/default-wallpaper.png').then((_) => {
  //     setLoadStatus(true);
  //   });
  // }, [wallpaper]);

  return (
    <div className={`background ${isBlur ? 'blur' : ''}`}>
      {/* <TransitionGroup
        visible={loadStatus}
        enterAnimation="fadeIn"
        leaveAnimation="fadeOut"
        className="wallpaper-transition"
      >
        {loadStatus && (
          <div
            className="wallpaper-image"
            style={{ backgroundImage: `url(${wallpaper})` }}
          ></div>
        )}
      </TransitionGroup>
      <canvas ref={canvasMain} className="none" id="canvas"></canvas> */}
    </div>
  );
}
