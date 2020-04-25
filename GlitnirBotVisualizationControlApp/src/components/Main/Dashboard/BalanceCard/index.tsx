import React from "react";
import styled from "styled-components";

export default function BalanceCard() {
  const StyledBalanceCard = styled.div`
    width: 320px;
    height: 80px;
    background-color: #2c3e50;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    box-shadow: 0 0 10px rgba(127, 140, 141, 0.2);
  `;

  const Title = styled.h4`
    margin: 0;
    color: #fff;
    font-family: "Poppins", sans-serif;
    font-weight: 300;
  `;

  const Content = styled.h1`
    margin: 0;
    color: #fff;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
  `;

  const Balance = styled.div`
    /* background-color: aqua; */
    margin-left: 20px;
    flex-direction: column;
  `;

  return (
    <StyledBalanceCard>
      <Balance>
        <Title>Balance</Title>
        <Content>$ 1000.00</Content>
      </Balance>
    </StyledBalanceCard>
  );
}
