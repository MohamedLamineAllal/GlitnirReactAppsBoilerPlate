import React, { useEffect, useRef, useState, Ref } from 'react';
import styled from 'styled-components';
import { IDataVisualizationBox } from '../../DataVisualization/interface';
import { getComponent, getPredefinedComponent } from '../../ComponentAccessor';
import { IDashboardBoxComponent, IDashboardBoxComponentProps, DataFeeder } from '../../types/VisualizationSystem';
import { get_processFeedCache} from '../../utils/cache';
export interface OneDataFeed {
    signature?: string,
    componentTypeIdentifier?: string, // TODO: Generate the all identifier (with .)
    // TODO: for now we do that ! Later we see all the forms
    // to change it to smart selection and mapping! (all, by lists, ...etc)
    isCustom?: boolean,
    payload: any[]
}

export interface DataFeed { // <-------------------
    [signature: string]: OneDataFeed
}

export interface ComponentRef {
    Component: IDashboardBoxComponent,
    componentTypeIdentifier: string,
    isCustomType?: boolean
}

export interface ComponentRefs {
    [signature: string]: ComponentRef
}

export interface DataFeederRefObj { // <---------------------
    dataFeeder?: DataFeeder,
    dataToFeedsCache: OneDataFeed[] // TODO: don't forget to process the cache
}

// ___ [method]
const processFeedCache = get_processFeedCache<OneDataFeed>(
    (feedData) => feedData.payload
);

async function dataFeedResolver(
    data: DataFeed,
    componentsRefBySignature: ComponentRefs,
    setComponentsRefBySignature: (ref: ComponentRefs) => void,
    feedRefBySignature: Map<string, DataFeederRefObj>
) {
    let componentRef: ComponentRef;
    let feederRef: DataFeederRefObj;
    let dataFeed: OneDataFeed;
    for (const signature of Object.keys(data)) {
        dataFeed = data[signature];
        componentRef = componentsRefBySignature[signature];
        if (componentRef) {
            /**
             * component exists
             */

            // ____________________________ update and add data
            feederRef = feedRefBySignature.get(signature) as DataFeederRefObj;

            if (feederRef) {
                if (feederRef.dataFeeder) {
                    processFeedCache(
                        feederRef.dataToFeedsCache,
                        feederRef.dataFeeder.update
                    );
                    feederRef.dataFeeder.updateMany(dataFeed.payload); // TODO: managing the payload and it's form
                } else {
                    feederRef.dataToFeedsCache.push(dataFeed); // TODO: don't forget to handle he cache
                }
            } else {
                // ______________________________ manage it by caching
                throw new Error('manage in cache ref doesn\'t exist while component does');
            }
        } else {
            /**
             * Component doesn't exist (first time)
             */
            const Component = await getComponent(
                dataFeed.componentTypeIdentifier as string,
                dataFeed.payload,
                dataFeed.isCustom
            );

            if (Component) {
                feedRefBySignature.set(
                    signature,
                    {
                        dataFeeder: undefined,
                        dataToFeedsCache: [dataFeed]
                    }
                );

                setComponentsRefBySignature({
                    ...componentsRefBySignature,
                    [signature]: {
                        Component,
                        componentTypeIdentifier: dataFeed.componentTypeIdentifier as string,
                        // TODO: add signature to componentTypeIdentifier from custom dashboard
                        isCustomType: dataFeed.isCustom
                    }
                });
            }
        }
    }
}


const Container = styled.div`

`;

const BoxContainer = styled.div`

`;

export interface VerticalDynamicContainerProps extends IDashboardBoxComponentProps {
    id: string
}

/**
 * TODO: form
 *
 * @export
 * @param {React.PropsWithChildren<VerticalDynamicContainerProps>} {
 *     getFeeder,
 *     dataSignatureSymbol
 * }
 * @returns
 */
export function VerticalDynamicContainer({
    id,
    getFeeder
}: React.PropsWithChildren<VerticalDynamicContainerProps>) {
    const [componentsRefBySignature, setComponentsRefBySignature] = useState<any>({});
    const feedRefBySignature = useRef(new Map<string, DataFeederRefObj>());

    useEffect(() => {
        if (typeof getFeeder === 'function') {
            const setMany = function (data: DataFeed[]) {
                // TODO:
            }

            const set = function (data: DataFeed) {
                setMany([data]);
            };

            const update = function (data: DataFeed) {
                console.log("UPDATE DYNAMIC CONTAINER");
                dataFeedResolver(
                    data,
                    componentsRefBySignature,
                    setComponentsRefBySignature,
                    feedRefBySignature.current
                );
            }

            const updateMany = function (data: DataFeed[]) {
                console.log("update DYNAMIC CONTAINER (UPDATE MANY)");
                for (const d of data) {
                    update(d); // TODO: optimize
                }
            }

            getFeeder({
                set,
                setMany,
                update,
                updateMany
            });
        }

        return () => {
            // clear
        };
    }, []);

    const componentsBoxes: JSX.Element[]  = [];
    let compRef!: ComponentRef;
    for (const signature of Object.keys(componentsRefBySignature)) {
        if (componentsRefBySignature[signature]) {
            compRef = componentsRefBySignature[signature];

            if (compRef.Component) {
                componentsBoxes.push(
                    <BoxContainer
                        key={signature}
                    >
                        <compRef.Component
                            getFeeder={(feeder) => {
                                const feedRef = feedRefBySignature.current.get(signature) as DataFeederRefObj;
                                feedRef.dataFeeder = feeder;
                                processFeedCache(feedRef.dataToFeedsCache, feeder.update);
                            }}
                        />
                    </BoxContainer>
                );
            }
        }
    }

    return <Container>
        {
            componentsBoxes
        }
    </Container>;
}
// TODO: add dynamic or some kind of concept to load components of different types and dynamically
