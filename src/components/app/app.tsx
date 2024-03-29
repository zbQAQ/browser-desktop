import React from 'react';
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';

// import MissionBar from "@/components/missionBar/missionBar"

import { AppInfoProvider } from '@/context/appInfoProvider';

import './app.css';

// pages
import Home from '@/pages/home/home';

type Props = RouteComponentProps<any>;

class App extends React.Component<Props> {
  public render() {
    return (
      <div className="app">
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <AppInfoProvider>
                <Home />
              </AppInfoProvider>
            )}
          ></Route>
        </Switch>
        {/* <MissionBar /> */}
      </div>
    );
  }
}

export default withRouter(App as any);
