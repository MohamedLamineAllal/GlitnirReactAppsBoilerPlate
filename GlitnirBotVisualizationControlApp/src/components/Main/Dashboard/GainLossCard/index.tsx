import React from "react";
import styled from "styled-components";

export default function GainLossCard() {
  const Card = styled.div`
    /* width: 290px; */
    height: 200px;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: #2c3e50;
    flex-direction: column;
    color: white;
    /* justify-content: space-around; */
  `;

  const H4 = styled.h4`
    margin: 0;
    font-family: "Poppins", sans-serif;
    font-weight: 300;
  `;

  const H1 = styled.h1`
    margin: 0;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
  `;

  const Average = styled.h3`
    margin: 0;
    font-family: "Poppins", sans-serif;
    font-weight: 400;
    color: #2ecc71;
  `;

  return (
    <Card>
      <H4>Monthly Gain</H4>
      <H1>$ 100,00.00</H1>
      <H4>Last Month</H4>
      <Average>$0.00 up ( 10% )</Average>
    </Card>
  );
}
