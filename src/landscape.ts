import { engine, AudioSource, GltfContainer, ColliderLayer, Transform, TextShape, Billboard, MeshRenderer, Material, MaterialTransparencyMode, PBBillboard } from "@dcl/sdk/ecs"
import { Vector3, Quaternion } from "@dcl/sdk/math"
import { carnivalSound } from "./resource"
import { onEnterScene, onLeaveScene } from '@dcl/sdk/src/players'
import * as utils from '@dcl-sdk/utils' 

export function addLandscape() {

    Transform.getMutable(carnivalSound).position = Vector3.create(23,3, 23)
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

    //const ceiling = engine.addEntity()
    //GltfContainer.create(ceiling, {
     //  src: 'models/ceiling.glb'
    //})
    //Transform.create(ceiling, {
       // position: Vector3.create(19, 0, 19),
       // scale: Vector3.create(19,19,19)
   // })

    const ceiling3 = engine.addEntity()
    GltfContainer.create(ceiling3, {
        src: 'models/ceiling-maybe.glb'
    })
    Transform.create(ceiling3, {
        position: Vector3.create(21, 0, 21),
        scale: Vector3.create(19.5,19.5,19.5)
    })

/*
    const ceiling2 = engine.addEntity()
    GltfContainer.create(ceiling2, {
        src: 'models/glassdome.glb'
    })
    Transform.create(ceiling2, {
        position: Vector3.create(21, 0, 21),
        scale: Vector3.create(20,20,20)
    })*/

    const monkey = engine.addEntity();
    GltfContainer.create(monkey,
        {
        src: "models/monkey.glb",
        visibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS,
        invisibleMeshesCollisionMask:  ColliderLayer.CL_PHYSICS,
        })

    Transform.create(monkey, {
        position: Vector3.create(27, 8, 23),
        scale: Vector3.create(4, 4, 4),
        rotation: Quaternion.fromEulerDegrees(0 , 0, 0)
    })

    
    const followMe = engine.addEntity()
    Transform.create(followMe, {
        position: Vector3.create(16, 31, 16),
        scale: Vector3.create(11,11,11),
        rotation: Quaternion.fromEulerDegrees(180 , 90, 0)
    })
    
    MeshRenderer.setPlane(followMe)

    Material.setPbrMaterial(followMe, {
        texture: Material.Texture.Common({
          src: 'images/arrow.png',
        }),
        transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND,
      })

      
//illboard.create(followMe)
    /*

    const followMePoints = [62,    58 , 54]
  
  
    followMePoints.map(i => {
        const followMeTransform = Transform.getMutable(followMe)
        const directionTransform = Transform.getMutable(direction)
        followMeTransform.position = Vector3.create(i, 3, i)
        directionTransform.position = Vector3.create(i, 3, i)
    })
        

    let followMeStep = 62
    utils.timers.setInterval( () => {


        
        const followMeTransform = Transform.getMutable(followMe)
        const directionTransform = Transform.getMutable(direction)
        followMeTransform.position = Vector3.create(followMeStep, 3, followMeStep)
        directionTransform.position = Vector3.create(followMeStep, 3, followMeStep)

        if (followMeStep <= 35) {
            followMeStep = 62
        } else {
            followMeStep = followMeStep - 1
        }

      }, 200)*/

}