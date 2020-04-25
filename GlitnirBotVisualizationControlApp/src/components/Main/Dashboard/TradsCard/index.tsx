import React from "react";
import styled from "styled-components";
import {Box , InfiniteScroll , Text} from 'grommet'


export default function TradsCard() {
  const StyledBalanceCard = styled.div`
    width: 320px;
    height: 100%;
    background-color: #2c3e50;
    margin-top: 5px;
    display: flex;
    box-shadow: 0 0 10px rgba(127, 140, 141, 0.2);
  `;

  const Title = styled.h5`
    margin: 0;
    color: #fff;
    margin-left: 20px;
    margin-top: 10px;
    font-family: "Poppins", sans-serif;
    font-weight: 500;
  `;

  return (
    <StyledBalanceCard>
      <Title>Trads</Title>
      <Box height="small" overflow="auto">
        <InfiniteScroll items={[1, 2, 3, 4, 5, 6, 7]}>
          {(item) => (
            <Box
              flex={false}
              pad="medium"
              background={`dark-${(item % 3) + 1}`}
            >
              <Text>{item}</Text>
            </Box>
          )}
        </InfiniteScroll>
      </Box>
    </StyledBalanceCard>
  );
}
