export function get_processFeedCache<BufferData>(
    bufferDataToPayload?: (data: BufferData) => any
) {
    if (bufferDataToPayload) {
        return (
            cacheBuffer: BufferData[],
            feedMethod: (data: BufferData) => void
        ) => {
            /**
             * splice to make sure the cache can receive more and no corruption
             */
            for (const dataFeed of cacheBuffer.splice(0)) {
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
        for (const dataFeed of cacheBuffer.splice(0)) {
            feedMethod(dataFeed);
        }
    }
}
