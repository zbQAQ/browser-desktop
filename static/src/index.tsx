import React from "react";
import ReactDOM from "react-dom";
import './app.css'
class App extends React.Component {
  public render() {
    return <div className="red">hellooooooo react</div>;
  }
}
ReactDOM.render(<App />, document.getElementById("root"));
