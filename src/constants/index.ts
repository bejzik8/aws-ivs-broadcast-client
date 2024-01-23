import { StreamConfig } from 'amazon-ivs-web-broadcast'

export const streamKey = import.meta.env.VITE_INGEST_ENDPOINT
export const ingestEndpoint = import.meta.env.VITE_STREAM_KEY

export const streamConfig: StreamConfig = {
    maxResolution: {
        width: 480,
        height: 480
    },
    maxFramerate: 30,
    maxBitrate: 3500
}
