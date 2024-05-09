import { GltfContainer, InputAction, PointerEventType, Transform, engine, executeTask, inputSystem } from '@dcl/sdk/ecs'
import { getUserData } from '~system/UserIdentity';
import { addClues } from './ui';
import { addLandscape } from './landscape';
import { addMarbles } from './marbles';
import { createQuestsClient } from '@dcl/quests-client'
import { actionEvents } from './event';
import { Action } from '@dcl/quests-client/dist/protocol/decentraland/quests/definitions.gen';
import { triggerSceneEmote } from '~system/RestrictedActions';
import { Vector3 } from '@dcl/sdk/math';

export function main() {
  
  const MY_QUEST_ID = 'd771e328-4b1d-4fd2-a105-fefcae8bd848'
  /*
  const baseScene = engine.addEntity()
    GltfContainer.create(baseScene, {
        src: 'models/neon_stage.glb'
    })
    Transform.create(baseScene, {
        position: Vector3.create(25, .5, 25),
        scale: Vector3.create(.5,.5,.5)
    })*/
    
  addLandscape();
  addClues();

  
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
    addMarbles(userData, 4, 'models/marble.glb')

  });

  
}

