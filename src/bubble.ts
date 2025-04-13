
import { Animator, ColliderLayer, Entity, GltfContainer, Transform, TransformType, engine } from '@dcl/sdk/ecs'
import * as utils from '@dcl-sdk/utils' 
import { Quaternion, Vector3 } from '@dcl/sdk/math';

export class Bubble {
    bubbleEntity: Entity;
    egg: Entity | null = null;
    hasEgg = false;
    isBooby = false;

    isOpen = false;
    counter = 0;
  
    constructor(modelPath: string,  transform: TransformType, hasEgg: boolean, isBooby: boolean) {
        this.bubbleEntity = engine.addEntity()
       
        this.hasEgg = hasEgg;
        this.isBooby = isBooby

        if (hasEgg){
          this.egg = engine.addEntity()
          GltfContainer.create(this.egg, {
            src: 'models/egg.glb',
          
            visibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS,
            invisibleMeshesCollisionMask: ColliderLayer.CL_POINTER
          })
          
          Transform.create(this.egg, {

            position: Vector3.create(-1,2,1),
            scale: Vector3.create(111,111,111),
            rotation: Quaternion.fromEulerDegrees(0, 0, 0),
            parent: this.bubbleEntity
          })
        } 

        Animator.create(this.bubbleEntity, {
          states: [
             {
                clip: 'Take 001_Object_6',
                playing: false,
                loop: false,
                shouldReset: true
             }
          ]
        })  
      
        Animator.stopAllAnimations(this.bubbleEntity, true)

        Transform.create(this.bubbleEntity, transform)
          GltfContainer.create(this.bubbleEntity, {
            src: modelPath,
            visibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS,
            invisibleMeshesCollisionMask: ColliderLayer.CL_POINTER
        })
      }
  }
  
  
  