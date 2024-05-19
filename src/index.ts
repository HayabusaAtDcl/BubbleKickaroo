import { executeTask } from '@dcl/sdk/ecs'
import { getUserData } from '~system/UserIdentity';
import { addUi } from './ui';
import { addLandscape } from './landscape';
import { publishVisitor } from './serverHandler';
import { addBubbles } from './marbles';
//import { addQuest } from './quest';
export function main() {

  publishVisitor()
  addLandscape();
  addUi();
  
  executeTask(async () => {
    let userData = await getUserData({});
    addBubbles(userData, 4, 'models/marble.glb');
  });  
}
