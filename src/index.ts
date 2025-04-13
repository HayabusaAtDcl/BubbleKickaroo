import { ColliderLayer, engine, executeTask, GltfContainer, MeshCollider, MeshRenderer, Transform } from '@dcl/sdk/ecs'
import { addBubbles } from './marbles';
import { addUi } from './ui';
import { LSCQuesting } from './questing';
import * as utils from '@dcl-sdk/utils' 
import { showLSCQuestIcon } from 'lsc-questing-dcl';
import { Vector3, Quaternion } from '@dcl/sdk/math';
import { movePlayerTo, triggerSceneEmote } from '~system/RestrictedActions';


export function main() {

  
  //LSCQuestLocalCreator(true)
  LSCQuesting()

  showLSCQuestIcon(true)
  addUi();
  addBubbles(52, 'models/gift.glb');

}
