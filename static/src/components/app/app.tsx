import React from "react"
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps,
  Link
} from 'react-router-dom';

import Background from "../background/background"

type Props = RouteComponentProps<any>;

class App extends React.Component<Props> {
  public render() {
    return (
      <Switch>
        <Background>
          <Route exact path="/" render={() => <CmpRoot />}></Route>
          <Route exact path="/aa" render={() => <Cmpaa />}></Route>
        </Background>
      </Switch>
    )
  }
}

function Cmpaa() {
  return (
    <div>
      hi aa<br />
      <Link to='/'>root页</Link>
    </div>
  )
}

function CmpRoot() {
  return (
    <div>
      hi root<br />
      <Link to='/aa'>aa页</Link>
    </div>
  )
}

export default withRouter(App)