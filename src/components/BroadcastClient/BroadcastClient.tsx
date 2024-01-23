import { useEffect, useRef, useState } from 'react'
import IVSBroadcastClient from 'amazon-ivs-web-broadcast'

import { AudioDevice, VideoDevice } from '../../models'
import { ingestEndpoint, streamKey, streamConfig } from '../../constants'

import styles from './BroadcastClient.module.css'

const client = IVSBroadcastClient.create({
    streamConfig,
    ingestEndpoint
})

async function handlePermissions() {
    let permissions = {
        audio: false,
        video: false
    }

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })

        for (const track of stream.getTracks()) {
            track.stop()
        }

        permissions = { video: true, audio: true }
    } catch {
        permissions = { video: false, audio: false }
    }

    if (!permissions.video) console.error('Failed to get video permissions.')
    if (!permissions.audio) console.error('Failed to get audio permissions.')
}

export function BroadcastClient() {
    const [broadcasting, setBroadcasting] = useState(false)

    const canvas = useRef(null)

    useEffect(() => {
        const loadInitial = async () => {
            await handlePermissions()

            if (canvas.current) client.attachPreview(canvas.current)

            getStream()
        }

        loadInitial()

        return () => {
            client?.detachPreview()
            client?.stopBroadcast()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getStream = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices()

        const videoDevices = devices.filter(
            d => d.kind === 'videoinput'
        ) as VideoDevice[]

        const audioDevices = devices.filter(
            d => d.kind === 'audioinput'
        ) as AudioDevice[]

        const cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                deviceId: videoDevices?.[0]?.deviceId,
                width: {
                    ideal: streamConfig.maxResolution.width
                },
                height: {
                    ideal: streamConfig.maxResolution.height
                }
            }
        })

        const microphoneStream = await navigator.mediaDevices.getUserMedia({
            audio: { deviceId: audioDevices?.[0]?.deviceId }
        })

        client.addVideoInputDevice(cameraStream, 'camera1', { index: 0 })
        client.addAudioInputDevice(microphoneStream, 'mic1')
    }

    const startBroadcast = async () => {
        await client.getAudioContext().resume()

        try {
            await client.startBroadcast(streamKey)

            setBroadcasting(true)

            console.log('->> Broadcast started...')
        } catch {
            console.log('->> Issue starting broadcast...')
        }
    }

    const stopBroadcast = () => {
        client.stopBroadcast()

        setBroadcasting(false)
    }

    return (
        <div>
            <canvas className={styles.canvas} ref={canvas} />
            {streamKey && (
                <div>
                    {!broadcasting ? (
                        <button onClick={startBroadcast}>
                            Start Broadcast
                        </button>
                    ) : (
                        <button onClick={stopBroadcast}>Stop Broadcast</button>
                    )}
                </div>
            )}
        </div>
    )
}
