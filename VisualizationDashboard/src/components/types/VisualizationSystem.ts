import { ExtensionOf } from "../../types/utility";
import { FC } from "react";

export interface DataFeeder<DataType = any> {
    update: (data: ExtensionOf<DataType>) => void,
    updateMany: (data: ExtensionOf<DataType>[]) => void,
    set: (data: ExtensionOf<DataType>) => void
    setMany: (data: ExtensionOf<DataType>[]) => void
}

export interface IDashboardBoxComponentProps<FeederDataType = any> {
    getFeeder: (feeder: DataFeeder<FeederDataType>) => void
}

export type IDashboardBoxComponent<FeederDataType = any> = FC<
    ExtensionOf<
        IDashboardBoxComponentProps<FeederDataType>
    >
>;
