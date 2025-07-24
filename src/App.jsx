import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import MyUI5View from "./ui5/MyUI5View";
import MySecondUI5View from "./ui5/MySecondUI5View";

function Home() {
  return (
    <div>
      <h2>Home</h2>
      <Link to="/view">Show UI5 View</Link>
      <br />
      <Link to="/other">Show other UI5 View</Link>
    </div>
  );
}

class App extends React.Component {

  render() {
    return (
      <Router>
        <div>
          <Routes>
            <Route path="/view" element={<MyUI5View />} />
            <Route path="/other" element={<MySecondUI5View />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>      
    );
  }


}

export default App;
