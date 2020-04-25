import React from "react";
import styled from "styled-components";

interface EngineCardProps {
  startStop: string;
  engineName: string;
}

export default function EngineCard(props: EngineCardProps) {
  const Card = styled.div`
    width: 320px;
    height: 180px;
    display: flex;
    flex-direction: column;
    border-radius: 2px;
    background-color: silver;
  `;

  const CardHeader = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  `;

  const CardFooter = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
  `;

  const H3 = styled.h3`
    margin: 0;
  `;

  return (
    <Card>
      <CardHeader>{props.engineName}</CardHeader>
      <CardFooter>
        <H3>{props.startStop}</H3>
      </CardFooter>
    </Card>
  );
}
