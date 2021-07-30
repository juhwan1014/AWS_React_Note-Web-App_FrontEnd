import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { useHistory } from "react-router-dom";
import { AppContext } from "./libs/contextLib";
import { onError } from "./libs/errorLib";
import { LinkContainer } from "react-router-bootstrap";
import Subbar from './components/Subbar'
import "./App.css";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from './images/logo-White.png'
import './Styles/Navbar.css';
import Routes from './components/Routes'




function App() {
  const history = useHistory();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e);
      }
    }

    setIsAuthenticating(false);
  }

  async function handleLogout() {
    await Auth.signOut();

    userHasAuthenticated(false);

    history.push("/login");
  }

  return (
    !isAuthenticating && (

    <div >
      <Navbar collapseOnSelect>
        
      <Navbar.Toggle />
    <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
              <Subbar />
    </AppContext.Provider>  
    <Navbar.Collapse className="justify-content-end">
      <LinkContainer to="/">
          <Navbar.Brand>
          <img src={logo} className="App-logo" alt="logo" />
          </Navbar.Brand>
        </LinkContainer>
            <Nav activeKey={window.location.pathname}>
              {isAuthenticated ? (
                <>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
            <LinkContainer to="/Register">
              <Nav.Link>Register</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/login">
              <Nav.Link>Login</Nav.Link>
            </LinkContainer>
            </>
              )}
          </Nav>
          </Navbar.Collapse>
          </Navbar>
          <AppContext.Provider value={{ isAuthenticated, userHasAuthenticated }}>
              <Routes />
          </AppContext.Provider>

  
          </div>
     )

  );
}

export default App;