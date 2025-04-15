import { engine, AudioSource, Transform, Billboard, Material, MeshRenderer } from "@dcl/sdk/ecs"


export const waoSound = engine.addEntity()
Transform.create(waoSound)
AudioSource.create(waoSound, { audioClipUrl: 'sounds/wao.mp3',  playing: false })

export const yaySound = engine.addEntity()
Transform.create(yaySound)
AudioSource.create(yaySound, { audioClipUrl: 'sounds/yay.mp3',  playing: false })

export const popSound = engine.addEntity()
Transform.create(popSound)
AudioSource.create(popSound, { audioClipUrl: 'sounds/pop.mp3',  playing: false })

export const tickTockSound = engine.addEntity()
Transform.create(tickTockSound)
AudioSource.create(tickTockSound, { audioClipUrl: 'sounds/ticktock.mp3',  playing: false })

export const noSound = engine.addEntity()
Transform.create(noSound)
AudioSource.create(noSound, { audioClipUrl: 'sounds/nonono.mp3',  playing: false })

export const collectSound = engine.addEntity()
Transform.create(collectSound)
AudioSource.create(collectSound, { audioClipUrl: 'sounds/collect.mp3',  playing: false })

export function generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

