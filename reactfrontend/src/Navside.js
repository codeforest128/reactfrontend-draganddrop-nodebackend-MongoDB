import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from 'react-bootstrap/Nav'

class Navside extends React.Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">Navbar</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/">Components</Nav.Link>
          <Nav.Link href="/second">Experiment</Nav.Link>
        </Nav>
      </Navbar>
    );
  }
}

export default Navside;
