import React from "react"
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps,
  Link
} from 'react-router-dom';

import Wallpaper from "../wallpaper/wallpaper"

// pages
import Home from "@/pages/home/home"

type Props = RouteComponentProps<any>;

class App extends React.Component<Props> {
  public render() {
    return (
      <div className="app">
        <Wallpaper />
        <Switch>
          <Route exact path="/" render={() => <Home />}></Route>
        </Switch>
      </div>
    )
  }
}

export default withRouter(App)