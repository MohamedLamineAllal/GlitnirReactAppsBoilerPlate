import React, { useState } from "react";
import { InfiniteScroll, Box, Text } from "grommet";
import styled from "styled-components";

// //import {} from "grommet-icons";

// const allItems = ((limit: number) => {
//   let arr: string[] = [];
//   for (let i = 0; i < limit; i++) arr.push(`item ${i}`);
//   return arr;
// })(2000);

interface StatisticItemsKeys {
  statisticType: string;
  allValue: string[] | string;
  longValue: string[] | string;
  shortValue: string[] | string;
}

export default (function Statistics({
  statisticType,
  allValue,
  longValue,
  shortValue
}) {
  const StatisticItem = styled.div``;
  const StatisticRow = styled.div`
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 40px;
    justify-content: space-around;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: #dcdde1;
    border-bottom-style: solid;
    margin-top: 5px;
    color: #2f3640;
  `;

  return (
    <StatisticItem>
      <StatisticRow>
        <Text>{statisticType}</Text>
        <Text>{allValue}</Text>
        <Text>{longValue}</Text>
        <Text>{shortValue}</Text>
      </StatisticRow>
    </StatisticItem>
  );
} as React.ComponentType<StatisticItemsKeys>);
