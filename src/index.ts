import { GltfContainer, InputAction, Material, MaterialTransparencyMode, MeshRenderer, PointerEventType, TextureWrapMode, Transform, engine, executeTask, inputSystem } from '@dcl/sdk/ecs'
import { getUserData } from '~system/UserIdentity';
import { addClues } from './ui';
import { addLandscape } from './landscape';
import { addMarbles } from './marbles';
import { createQuestsClient } from '@dcl/quests-client'
//import { actionEvents } from './event';
import { Action } from '@dcl/quests-client/dist/protocol/decentraland/quests/definitions.gen';
import { triggerSceneEmote } from '~system/RestrictedActions';
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math';

export function main() {

 
  //const MY_QUEST_ID = 'd771e328-4b1d-4fd2-a105-fefcae8bd848'
  /*
  const wallfloor = engine.addEntity()
  Transform.create(wallfloor, {
      position: Vector3.create(32, 0.5, 32),
      rotation: Quaternion.fromEulerDegrees(90 , 90, 0),
      scale: Vector3.create(41,32,32)
  })

  Material.setPbrMaterial(wallfloor, {
   albedoColor: Color4.Red()
  })
  
  MeshRenderer.setPlane(wallfloor)


  // Invisible walls
  const xwallShape =  engine.addEntity()
  Transform.create(xwallShape, {
    position: Vector3.create(30, 0, 50),
    scale:Vector3.create(41,11,11)
   
})

Material.setPbrMaterial(xwallShape, {
 albedoColor: Color4.Green()
})
MeshRenderer.setPlane(xwallShape)

// Invisible walls
const xwallShape2 =  engine.addEntity()
Transform.create(xwallShape2, {
  position: Vector3.create(30, 0, 16),
  scale:Vector3.create(41,11,11)
 
})
MeshRenderer.setPlane(xwallShape2)
Material.setPbrMaterial(xwallShape2, {
albedoColor: Color4.Black()
})

const xwallShape3 =  engine.addEntity()
Transform.create(xwallShape3, {
  position: Vector3.create(16, 0, 30),
  scale:Vector3.create(41,11,11),
  rotation: Quaternion.fromEulerDegrees(0, 90, 0),
 
})
MeshRenderer.setPlane(xwallShape3)
Material.setPbrMaterial(xwallShape3, {
albedoColor: Color4.Gray()
})

const xwallShape4 =  engine.addEntity()
Transform.create(xwallShape4, {
  position: Vector3.create(48, 0, 35),
  scale:Vector3.create(41,11,11),
  rotation: Quaternion.fromEulerDegrees(0, 90, 0),
 
})
MeshRenderer.setPlane(xwallShape4)
Material.setPbrMaterial(xwallShape4, {
albedoColor: Color4.Blue()
})
      
  /* const baseScene = engine.addEntity()
    GltfContainer.create(baseScene, {
        src: 'models/square_shift.glb'
    })
    Transform.create(baseScene, {
        position: Vector3.create(32, 0, 32),
        scale: Vector3.create(8,8,8)
    })
     */
  addLandscape();
  //addClues();

  
/*
  
engine.addSystem(() => {
  if (inputSystem.isTriggered(InputAction.IA_SECONDARY, PointerEventType.PET_DOWN)){
    triggerSceneEmote({ src: 'animations/loser2.glb', loop: true })
  }
})
*/

  executeTask(async () => {
/*
    const serviceUrl = 'wss://quests-rpc.decentraland.org'
    try {
      const questsClient = await createQuestsClient(serviceUrl, MY_QUEST_ID)

      const x = questsClient.isQuestStarted();
      if (x == false) {
        const result = await questsClient.startQuest()

        if (result) {
          console.log('Quest started successfully!')
        } else {
          console.error("Quest couldn't be started")
        }
      } else {
        console.log("Quest already started")
      }

      actionEvents.on('action', async (action: Action) => {
        await questsClient.sendEvent({ action })
      })

    } catch (e) {
      console.error('Error on connecting to Quests Service')
    }
    */
    let userData = await getUserData({})
    addMarbles(userData, 24, 'models/marble.glb')

    /* const portrait = engine.addEntity()
    Transform.create(portrait, {
        position: Vector3.create(32, 11, 32),
        rotation: Quaternion.fromEulerDegrees(0 , 90, 0),
        scale: Vector3.create(11,11,11)
    })
    
    MeshRenderer.setPlane(portrait)
    Material.setPbrMaterial(portrait, {
        texture: Material.Texture.Avatar({
          userId: '0xD3E5d76763dB46FE9e4ee25FA8D815c276b06c27'
        }),
      })

      console.log(userData?.data?.publicKey) */

  });

  
}

