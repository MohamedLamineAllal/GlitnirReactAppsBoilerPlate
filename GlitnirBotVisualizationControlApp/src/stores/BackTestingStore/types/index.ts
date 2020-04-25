import { StatisticsData } from "../../../types/trading";

// ___________________ processes list

// ___________________ statistics

export interface StatisticsDataByProcess {
    [processId: string]: StatisticsData;
}