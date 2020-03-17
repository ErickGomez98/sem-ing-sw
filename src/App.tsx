import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
//@ts-ignore
import { AnimatedSwitch } from "react-router-transition";
import "./App.css";
import Results from "./pages/results";
import Statistics from "./pages/statistics";
import Home from "./pages/home";

function App() {
  return (
    <Router>
      <AnimatedSwitch
        atEnter={{ opacity: 0 }}
        atLeave={{ opacity: 0 }}
        atActive={{ opacity: 1 }}
        className="switch-wrapper"
      >
        <Route path="/results/:id" component={Results} />
        <Route exact path="/statistics" component={Statistics} />
        <Route exact path="/" component={Home} />
        <Redirect to="/" />
      </AnimatedSwitch>
    </Router>
  );
}

export default App;
