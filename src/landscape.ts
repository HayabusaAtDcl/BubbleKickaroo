import { engine, AudioSource, GltfContainer, ColliderLayer, Transform, TextShape, Billboard, MeshRenderer, Material, MaterialTransparencyMode, PBBillboard, TextureWrapMode } from "@dcl/sdk/ecs"
import { Vector3, Quaternion, Color4 } from "@dcl/sdk/math"
import { carnivalSound } from "./resource"
import { onEnterScene, onLeaveScene } from '@dcl/sdk/src/players'
import * as utils from '@dcl-sdk/utils' 

export function addLandscape() {

    Transform.getMutable(carnivalSound).position = Vector3.create(23,3, 23)
    AudioSource.getMutable(carnivalSound).playing = true
    AudioSource.getMutable(carnivalSound).loop = true


    

    
    const floor = engine.addEntity()
    Transform.create(floor, {
        position: Vector3.create(32, 0, 32),
        rotation: Quaternion.fromEulerDegrees(90 , 90, 0),
        scale: Vector3.create(64,64,64)
    })
    
    MeshRenderer.setPlane(floor)
    Material.setPbrMaterial(floor, {
        texture: Material.Texture.Common({
          src: 'images/floortile.png',

          wrapMode: TextureWrapMode.TWM_REPEAT,
        }),
        transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND,
      })
    


    const ceiling = engine.addEntity()
    GltfContainer.create(ceiling, {
        src: 'models/ceiling.glb'
    })
    Transform.create(ceiling, {
        position: Vector3.create(32, 0, 32),
        scale: Vector3.create(19.5,19.5,19.5),
       
    }) 



     const monkey = engine.addEntity();
    GltfContainer.create(monkey,
        {
        src: "models/monkey.glb",
        visibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS,
        invisibleMeshesCollisionMask:  ColliderLayer.CL_PHYSICS,
        })

    Transform.create(monkey, {
      
        position: Vector3.create(37, 11, 32),
        scale: Vector3.create(4, 4, 4),
        rotation: Quaternion.fromEulerDegrees(0, 0, 0)
    }) 

    
    const followMe = engine.addEntity()
    Transform.create(followMe, {
        position: Vector3.create(31, 31, 31),
        scale: Vector3.create(11, 11, 11),
        rotation: Quaternion.fromEulerDegrees(180 , 90, 0)
    })

    MeshRenderer.setPlane(followMe)
    Material.setPbrMaterial(followMe, {
        texture: Material.Texture.Common({
          src: 'images/arrow.png',
        }),
        transparencyMode: MaterialTransparencyMode.MTM_ALPHA_BLEND,
      })

}