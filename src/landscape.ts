import { engine, AudioSource, GltfContainer, ColliderLayer, Transform } from "@dcl/sdk/ecs"
import { Vector3, Quaternion } from "@dcl/sdk/math"
import { carnivalSound } from "./resource"

export function addLandscape() {

    Transform.getMutable(carnivalSound).position = Transform.get(engine.PlayerEntity).position
    AudioSource.getMutable(carnivalSound).playing = true
    AudioSource.getMutable(carnivalSound).loop = true

    const baseScene = engine.addEntity()
    GltfContainer.create(baseScene, {
        src: 'models/floor.glb'
    })
    Transform.create(baseScene, {
        position: Vector3.create(32, 0, 32),
        scale: Vector3.create(32,32,32)
    })

    const ceiling = engine.addEntity()
    GltfContainer.create(ceiling, {
        src: 'models/ceiling.glb'
    })
    Transform.create(ceiling, {
        position: Vector3.create(19, 0, 19),
        scale: Vector3.create(19,19,19)
    })

    const ceiling3 = engine.addEntity()
    GltfContainer.create(ceiling3, {
        src: 'models/ceiling-maybe.glb'
    })
    Transform.create(ceiling3, {
        position: Vector3.create(19, 0, 19),
        scale: Vector3.create(19.5,19.5,19.5)
    })


    const ceiling2 = engine.addEntity()
    GltfContainer.create(ceiling2, {
        src: 'models/glassdome.glb'
    })
    Transform.create(ceiling2, {
        position: Vector3.create(19, 0, 19),
        scale: Vector3.create(20,20,20)
    })

    const clown = engine.addEntity();
    GltfContainer.create(clown,
        {
        src: "models/clown2.glb",
        visibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS,
        invisibleMeshesCollisionMask:  ColliderLayer.CL_PHYSICS,
        })

    Transform.create(clown, {
        position: Vector3.create(8, -23, 8),
        scale: Vector3.create(111,111,111),
        rotation: Quaternion.fromEulerDegrees(0, 22, 0)
    })

   
}