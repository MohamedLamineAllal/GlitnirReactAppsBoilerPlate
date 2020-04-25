import predefinedComponents from './PredefinedComponents';
import dlv from 'dlv';
import { IDashboardBoxComponent } from '../types/VisualizationSystem';

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
    return Promise.resolve({} as any);
}

export async function getComponent<DataType = any>(
    componentIdentifier: string,
    data: DataType,
    isCustom?: boolean
): Promise<IDashboardBoxComponent | null> { // TODO: TYPE
    if (isCustom !== undefined) {
        if (isCustom) {
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
