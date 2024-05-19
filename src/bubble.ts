
import { AvatarShape, ColliderLayer, Entity, GltfContainer, Transform, TransformType, engine } from '@dcl/sdk/ecs'
import { Color3, Vector3 } from '@dcl/sdk/math';
import * as utils from '@dcl-sdk/utils' 

export class Bubble {
    bubbleEntity: Entity;
    miniMeEntity: Entity;
    isHidden: boolean = false;
    isRealMe = false;
    hintInterval: number = -1;
    counter = 0;
  
    constructor(modelPath: string, transform: TransformType, userData: any, cryStartDelay: number, isRealMe: boolean) {
        this.bubbleEntity = engine.addEntity()
        Transform.create(this.bubbleEntity, transform)
        GltfContainer.create(this.bubbleEntity, {
            src: modelPath,
            visibleMeshesCollisionMask: ColliderLayer.CL_PHYSICS,
            invisibleMeshesCollisionMask: ColliderLayer.CL_POINTER
        })
  
        this.miniMeEntity = engine.addEntity()
        this.isRealMe = isRealMe;

        AvatarShape.create(this.miniMeEntity, {
            id: " ",
            name: userData.data?.displayName,
            bodyShape: userData.data?.avatar?.bodyShape,
            hairColor: Color3.fromHexString(userData.data?.avatar?.hairColor??''),
            eyeColor: Color3.fromHexString(userData.data?.avatar?.eyeColor??''),
            skinColor:  Color3.fromHexString(userData.data?.avatar?.skinColor??''),   
            emotes : ["cry"],
            wearables: userData.data?.avatar?.wearables??[],
            expressionTriggerId: "cry",
            expressionTriggerTimestamp: Math.round(+new Date() / 1000)
        }) 

        Transform.create(this.miniMeEntity, {
            position: Vector3.create(transform.position.x, transform.position.y + 0.1, transform.position.z),
            scale: Vector3.create(.5,.5,.5)
        });

        utils.timers.setTimeout(()=>{
            this.createNpcHint();
        }, cryStartDelay);

    }

    public updateMiniMeHintInterval  = () => {
        utils.timers.clearInterval(this.hintInterval);
        this.createNpcHint();
    }
    
    private createNpcHint = () => {
        this.hintInterval = utils.timers.setInterval( () => {
            this.counter = this.counter + 1;
            let npc = AvatarShape.getMutableOrNull(this.miniMeEntity);
            if (npc != null) {
                if (this.counter >= 3 && this.isRealMe) {
                    this.counter = 0;
                    npc.emotes = ['kiss']
                    npc.expressionTriggerId = 'kiss'
    
                } else {
                    npc.emotes = ["cry"]
                    npc.expressionTriggerId = "cry"
                }
              
                npc.expressionTriggerTimestamp = Math.round(+new Date() / 1000)
            }
            
        }, 8000)
      }
  }
  
  
  