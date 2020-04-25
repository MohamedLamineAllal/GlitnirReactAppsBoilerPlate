// _______________________________________________________/ imports
// ______________________________ Data visualization components
import {
    CandleStickChart,
    createComponent as candleStickChart_createComponent
} from '../../DataVisualization/CandleStickChart';
import { LineChart, createComponent as lineChart_createComponent } from '../../DataVisualization/LineChart';

// ______________________________ Data layouts components
import { VerticalDynamicContainer } from '../../DashboardDataLayoutComponents/VerticalDynamicContainer';


// ______________________________________________________/ exports

// ______________________________ Data visualization components

export const VisualizationComponents = {
    CandleStickChart: candleStickChart_createComponent,
    LineChart: lineChart_createComponent
}

// ______________________________ Data layouts components

export const DataLayoutComponents = {
    VerticalDynamicContainer // TODO:
}

// ______________________________ global exports
export default {
    VisualizationComponents,
    DataLayoutComponents
}
