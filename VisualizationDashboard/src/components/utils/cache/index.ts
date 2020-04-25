export function get_processFeedCache<BufferData>(
    bufferDataToPayload?: (data: BufferData) => any
) {
    if (bufferDataToPayload) {
        return (
            cacheBuffer: BufferData[],
            feedMethod: (data: BufferData) => void
        ) => {
            console.log("process feed cache !!!!!!!!!!!!!!!!!!!!!!!");
            /**
             * splice to make sure the cache can receive more and no corruption
             */
            for (const dataFeed of cacheBuffer.splice(0)) {
                console.log("feed ====>")
                console.log(dataFeed)
                feedMethod(bufferDataToPayload(dataFeed));
            }
        }
    }

    return (
        cacheBuffer: BufferData[],
        feedMethod: (data: BufferData) => void
    ) => {
        /**
         * splice to make sure the cache can receive more and no corruption
         */
        console.log("process feed cache !!!!!!!!!!!!!!!!!!!!!!!");

        for (const dataFeed of cacheBuffer.splice(0)) {
            console.log("feed ====>")
            console.log(dataFeed)
            feedMethod(dataFeed);
        }
    }
}
