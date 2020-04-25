import React from "react";
import styled from "styled-components";

const Nav = styled.nav`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #2c3e50;
  width: 100vw;
  height: 10vh;
`;

const Logo = styled.h3`
  color: white;
  margin-left: 25px;
  color: #ffaf20;
  font-family: "Poppins", sans-serif;
  font-weight: 700;
`;

export default function DashboardNavigationBar() {
  return (
    <Nav>
      <Logo>GLITNIR</Logo>
    </Nav>
  );
}
