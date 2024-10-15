import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';

const NavigationBar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/exit'); // Redirect to the exit page
  };

  return (
    <Navbar className="navbar" expand="lg">
      <Container>
        <Navbar.Brand href="/">Go Meal</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/meal">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/create-meal">
              <Nav.Link>Create Meal</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/training">
              <Nav.Link>Training</Nav.Link>
            </LinkContainer>
          </Nav>
          <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
