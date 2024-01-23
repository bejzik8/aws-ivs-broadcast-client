export enum DEVICE_TYPE {
    VIDEO_INPUT = 'videoinput',
    AUDIO_INPUT = 'audioinput'
}

export type AudioDevice = {
    deviceId: string
    groupId: string
    kind: DEVICE_TYPE.AUDIO_INPUT
    label: string
}

export type VideoDevice = {
    deviceId: string
    groupId: string
    kind: DEVICE_TYPE.VIDEO_INPUT
    label: string
}
