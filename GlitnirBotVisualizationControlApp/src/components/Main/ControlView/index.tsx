import React from "react";
import styled from "styled-components";
import EngineCard from "./EngineCard";

export default function ControlView() {
  const Div = styled.div`
    display: flex;
    flex: 1;
    width: 100vw;
    height: 100vh;
  `;

  return (
    <Div>
      <EngineCard engineName="Engine DB" startStop="START" key={0}></EngineCard>
    </Div>
  );
}
