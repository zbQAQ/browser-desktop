import React from "react"
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps
} from 'react-router-dom';

import TransitionGroup from "@/components/transitionGroup/transitionGroup"
import MissionBar from "@/components/missionBar/missionBar"

import "./app.css"

// pages
import Home from "@/pages/home/home"
import Search from "@/pages/search/search"

type Props = RouteComponentProps<any>;

class App extends React.Component<Props> {
  public render() {
    console.log("location", location)
    return (
      <div className="app">
        <Switch>
          <Route exact path="/" render={() => <Home />}></Route>
          <Route exact path="/search" render={() => {
            return (
              <TransitionGroup
                visible={location.pathname === "/search"}
                enterAnimation="fadeIn"
                levaeAnimation="fadeOut" 
              >
                <Search /> 
              </TransitionGroup>
            )
          }}></Route>
        </Switch>
        <MissionBar />
      </div>
    )
  }
}

export default withRouter(App)