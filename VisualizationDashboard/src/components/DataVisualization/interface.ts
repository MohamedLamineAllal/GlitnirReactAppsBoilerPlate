import { FC } from "react";
import { IDashboardBoxComponentProps } from "../types/VisualizationSystem";
import { ExtensionOf } from "../../types/utility";

export interface IDataVisualizationBoxProps<FeederDataType = any> extends IDashboardBoxComponentProps<FeederDataType> {
    // TODO:
}

export type IDataVisualizationBox<FeederDataType = any> = FC<ExtensionOf<IDataVisualizationBoxProps<FeederDataType>>>;
