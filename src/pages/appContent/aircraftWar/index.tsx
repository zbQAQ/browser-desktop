import { useEffect, useState } from 'react';
import GameContainer from './components/gameContainer/gameContainer';
import { AircraftWarProvider } from '@/context/aircraftWarProvider';

import './index.less';

export default function AircraftWar() {
  const [loading, setLoading] = useState(true);

  const imagesResourcePromise = import.meta.globEager('./images/*.png');
  const imagesResourcePath = [
    './images/life.png',
    './images/bullet.png',
    './images/enemy0.png',
    './images/enemy1.png',
    './images/enemy2.png',
  ];

  useEffect(() => {
    // 提前加载图片资源
    const imagesResource = imagesResourcePath.map(
      (path) => imagesResourcePromise[path]
    );
    Promise.all(imagesResource).then(() => {
      setTimeout(() => {
        setLoading(false);
      }, 1200);
    });
  }, []);

  return (
    <AircraftWarProvider>
      <div className="aircraft-container">
        <GameContainer loading={loading} />
      </div>
    </AircraftWarProvider>
  );
}
