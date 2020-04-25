import React from "react";
import styled from "styled-components";
import { Button } from "grommet";

export default function ChartsSection() {
  const Section = styled.section`
    display: flex;
    flex: 1;
    background-color: #2c3e50;
    flex-direction: row;
  `;

  const DailyPrefDiv = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
  `;
  const ChartsDiv = styled.div`
    display: flex;
    flex: 2;
  `;

  const Title = styled.h1`
    margin: 0;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    font-size: 2rem;
  `;
  const Div = styled.div`
    display: flex;
    flex-direction: row;
    align-items: baseline;
  `;

  const BigTitle = styled.h1`
    margin: 0;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
    font-size: 3.5rem;
  `;

  const SubTitle = styled.h3`
    margin: 0;
    font-family: "Poppins", sans-serif;
    font-weight: 400;
  `;

  const StyledButton = styled.button`
    width: 250px;
    height: 40px;
    margin-top: 30px;
    background-color: #2c3e50;
    border: 3px solid #34495e;
    display: inline-block;
    font-size: 16px;
    color: white;
    cursor: pointer;
    :hover {
      background-color: #34495e;
    }
  `;

  return (
    <Section>
      <DailyPrefDiv>
        <Div>
          <BigTitle>1000$ /</BigTitle>
          <Title> +15% </Title>
        </Div>
        <SubTitle>Daily Performance</SubTitle>
        <StyledButton title="Request Withdraw (BTN)">
          Request Withdraw (BTN)
        </StyledButton>
      </DailyPrefDiv>
      <ChartsDiv></ChartsDiv>
    </Section>
  );
}
