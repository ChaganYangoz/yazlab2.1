import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Page } from "./pages/Page";
import { Home } from "./pages/Home";
function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/page">
            <Page />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
