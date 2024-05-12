import { GltfContainer, Transform, engine, executeTask } from '@dcl/sdk/ecs'
import { getUserData } from '~system/UserIdentity';
import { addClues } from './ui';
import { addLandscape } from './landscape';
import { addMarbles } from './marbles';
import { Vector3 } from '@dcl/sdk/math';
//import { addQuest } from './quest';
export function main() {

  addLandscape();
  addClues();
  
  executeTask(async () => {

    //await addQuest();

    let userData = await getUserData({});
    addMarbles(userData, 4, 'models/marble.glb');

  });  
}
