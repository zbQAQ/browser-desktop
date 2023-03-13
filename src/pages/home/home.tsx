import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Wallpaper from '@/components/wallpaper/wallpaper';
import Applications from '@/components/applications/applications';
import AppDialog from '@/components/appDialog/appDialog';

import { desktopApp } from '@/config/appContentMap';

import { queryParse } from '@/util/common';

import { AppInfoContext, APP_ACTION_TYPE } from '@/context/appInfoProvider';

import './home.less';

export default function Home() {
  const { appKey, dispatch } = useContext(AppInfoContext);
  const [dialogIsShow, setDialogIsShow] = useState(false);
  const history = useHistory();

  useEffect(() => {
    console.log('location.search', location.search);
    const urlParmas = queryParse(location.search);
    if (urlParmas.appKey) {
      dispatch({ type: APP_ACTION_TYPE.UPDATE_APP, appKey: urlParmas.appKey });
    }
  }, []);

  useEffect(() => {
    if (appKey) {
      const curApp = desktopApp.find(
        (v: IDesktopAppType) => v.key === appKey
      ) as IDesktopAppType;
      if (curApp) {
        if (curApp.showType === 'dialog') {
          setDialogIsShow(true);
        } else if (curApp.showType === 'newPage' && curApp.pagePath) {
          history.push(curApp.pagePath);
        }
      } else {
        console.error('未找到相关app');
      }
    } else {
      setDialogIsShow(false);
    }
  }, [appKey]);

  useEffect(() => {
    function triggerClose(e: KeyboardEvent) {
      if (e.key === 'Escape' || e.code === 'Escape') {
        setDialogIsShow(false);
        dispatch({ type: APP_ACTION_TYPE.CLEAR_APP });
      }
    }

    window.addEventListener('keyup', triggerClose);

    return () => {
      window.removeEventListener('keyup', triggerClose);
    };
  }, []);

  return (
    <>
      <Wallpaper isBlur={dialogIsShow} />
      <div className="home">
        <AppDialog visible={dialogIsShow}></AppDialog>
        <Applications visible={!dialogIsShow} />
      </div>
    </>
  );
}
