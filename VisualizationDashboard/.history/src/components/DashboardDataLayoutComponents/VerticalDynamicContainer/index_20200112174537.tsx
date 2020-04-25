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
    console.log("DATA RESOLVER :::::::::::::::::::::::::!");
    let componentRef: ComponentRef;
    let feederRef: DataFeederRefObj;
    let dataFeed: OneDataFeed;
    console.log("DATA =) ===")
    console.log(data)
    for (const signature of Object.keys(data)) {
        console.log("Signature ::: " + signature + " : ::::")
        dataFeed = data[signature];
        componentRef = componentsRefBySignature[signature];

        if (componentRef) {
            /**
             * component exists
             */

            // ____________________________ update and add data
            feederRef = feedRefBySignature.get(signature) as DataFeederRefObj;

            console.log("feeder ref ::")
            console.log(feederRef)
            if (feederRef) {
                console.log("FEED YES")
                if (feederRef.dataFeeder) {
                    console.log("data feeder yes")
                    console.log("PROCESS !!!! processFeedCache")
                    processFeedCache(
                        feederRef.dataToFeedsCache,
                        feederRef.dataFeeder.update
                    );
                    feederRef.dataFeeder.updateMany(dataFeed.payload); // TODO: managing the payload and it's form
                } else {
                    console.log("cache cache ====>")
                    feederRef.dataToFeedsCache.push(dataFeed); // TODO: don't forget to handle he cache
                }
            } else {
                // ______________________________ manage it by caching
                throw new Error('manage in cache ref doesn\'t exist while component does');
            }
        } else {
            console.log("GET COMPONENT CAUSE THERE IS NO REF")
            /**
             * Component doesn't exist (first time)
             */
            const Component = await getComponent(
                dataFeed.componentTypeIdentifier as string,
                dataFeed.payload,
                dataFeed.isCustom
            );

            console.log("Component ===")
            console.log(Component)

            if (Component) {
                console.log('"WE HAVE OUR COOL COMPONENT"')
                feedRefBySignature.set(
                    signature,
                    {
                        dataFeeder: undefined,
                        dataToFeedsCache: [dataFeed]
                    }
                );
                console.log("SET COMPONENTS REF BY SIG")
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

    function getComponentsRefBySignature() {
        return componentsRefBySignature;
    }

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
    console.log("DYNAMIC: componentsRefBySignature")
    console.log(componentsRefBySignature)
    for (const signature of Object.keys(componentsRefBySignature)) {
        if (componentsRefBySignature[signature]) {
            console.log("COMP REF : YES :");
            compRef = componentsRefBySignature[signature];

            if (compRef.Component) {
                console.log('COMP REF COMPONENT')
                console.log(compRef.Component);

                componentsBoxes.push(
                    <BoxContainer
                        key={signature}
                    >
                        <compRef.Component
                            getFeeder={(feeder) => {
                                console.log("BOX FEEDER DYNAMIC CONTAINER");
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
