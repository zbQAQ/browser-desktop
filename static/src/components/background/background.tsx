import React from "react"
import { RouteComponentProps, withRouter } from "react-router-dom"
import "./background.css"

type Props = RouteComponentProps<any>;

class background extends React.Component<Props> {
  render() {
    return (
      <div className="background">
        {this.props.children}
      </div>
    )
  }
}

export default withRouter(background)