import { engine, AudioSource, Transform, Billboard, Material, MeshRenderer } from "@dcl/sdk/ecs"

export const popSound = engine.addEntity()
Transform.create(popSound)
AudioSource.create(popSound, { audioClipUrl: 'sounds/pop.mp3',  playing: false })

export const carnivalSound = engine.addEntity()
Transform.create(carnivalSound)
AudioSource.create(carnivalSound, { audioClipUrl: 'sounds/carnival.mp3',  playing: false })

export const winSound = engine.addEntity()
Transform.create(winSound)
AudioSource.create(winSound, { audioClipUrl: 'sounds/win.mp3',  playing: false })