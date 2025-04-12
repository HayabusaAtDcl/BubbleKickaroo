import { engine, executeTask, MeshCollider, MeshRenderer, Transform } from '@dcl/sdk/ecs'
import { addBubbles } from './marbles';
import { addUi } from './ui';
import { LSCQuesting } from './questing';
import * as utils from '@dcl-sdk/utils' 
import { LSCQuestLocalCreator, showLSCQuestIcon } from 'lsc-questing-dcl';



export function main() {

  
  LSCQuestLocalCreator(true)
  LSCQuesting()

  showLSCQuestIcon(true)
  addUi();
  addBubbles(2, 'models/gift.glb');

}
