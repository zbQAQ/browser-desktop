import React from "react"
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps
} from 'react-router-dom';

import Wallpaper from "../wallpaper/wallpaper"
import MissionBar from "../missionBar/missionBar"

import "./app.css"

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
          <Route exact path="/search" render={() => <h1>search</h1>}></Route>
        </Switch>
        <MissionBar />
      </div>
    )
  }
}

export default withRouter(App)