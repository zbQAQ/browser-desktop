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
      <Switch>
        <Wallpaper>
          <Route exact path="/" render={() => <Home />}></Route>
          <Route exact path="/aa" render={() => <Cmpaa />}></Route>
        </Wallpaper>
      </Switch>
    )
  }
}

function Cmpaa() {
  return (
    <div>
      hi aa页<br />
      <Link to='/'>aa页</Link>
    </div>
  )
}

export default withRouter(App)