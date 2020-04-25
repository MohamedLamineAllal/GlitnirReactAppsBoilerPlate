import React from "react";
import styled from "styled-components";
import BalanceCard from "./BalanceCard";
import DashboardNavigationBar from "./Nav";
import TradsCard from "./TradsCard";
import GainLossCard from "./GainLossCard";
import ChartsSection from "./ChartsSection";

const Div = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #34495e;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
  padding: 10px;
  /* background-color: white; */
`;

const LeftCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-top: 10px;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: #34495e;
  align-items: center;
  padding: 10px;
`;
const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 90vh;
`;

export default function Dashboard() {
  const MidleCardMargin = styled.div`
    display: flex;
    flex: 1;
    margin-right: 10px;
    margin-left: 10px;
  `;
  return (
    <Div>
      <DashboardNavigationBar />
      <Container>
        <LeftContainer>
          <ChartsSection />

          <LeftCardContainer>
            <GainLossCard />
            <MidleCardMargin>
              <GainLossCard />
            </MidleCardMargin>
            <GainLossCard />
          </LeftCardContainer>
        </LeftContainer>

        <RightContainer>
          <BalanceCard />
          <TradsCard />
        </RightContainer>
      </Container>
    </Div>
  );
}
