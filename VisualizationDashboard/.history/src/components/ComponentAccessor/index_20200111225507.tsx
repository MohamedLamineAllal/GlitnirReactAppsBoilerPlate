import predefinedComponents from './PredefinedComponents';
import dlv from 'dlv';
import { IDashboardBoxComponent } from '../types/VisualizationSystem';
import customComponents from '../CustomComponents';

export function getPredefinedComponent<DataType = any>(
    componentIdentifier: string,
    data: DataType
): IDashboardBoxComponent | null {
    const componentCreator = dlv(predefinedComponents, componentIdentifier);

    if (!componentCreator) {
        return null;
    }

    return componentCreator(data);
}

export async function getCustomComponent<DataType = any>(
    componentIdentifier: string,
    data: DataType
): Promise<IDashboardBoxComponent | null> {
    // TODO: (from backend! From local cache! From loaded in memory!
    // See the best combination with memory usage consideration)

    // [NOTE] Temporally we are making them in an internal custom folde

    const componentCreator = dlv(customComponents, componentIdentifier);

    if (!componentCreator) {
        return null;
    }

    return componentCreator(data);
}

export async function getComponent<DataType = any>(
    componentIdentifier: string,
    data: DataType,
    isCustom?: boolean
): Promise<IDashboardBoxComponent | null> { // TODO: TYPE
    if (isCustom !== undefined) {
        console.log("is it custom!!!  not undefined")
        if (isCustom) {
            console.log("GETTING SUPER CUSTOM !!!!!")
            return getCustomComponent<DataType>(
                componentIdentifier,
                data
            );
        }
        return getPredefinedComponent<DataType>(
            componentIdentifier,
            data
        );
    }

    // _________________________ if isCustom is undefined
    /**
     * check first predefined then custom if there isn't
     */
    return getPredefinedComponent<DataType>(
        componentIdentifier,
        data
    ) || getCustomComponent<DataType>(
        componentIdentifier,
        data
    );
}
