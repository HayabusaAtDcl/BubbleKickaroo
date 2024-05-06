import { executeTask } from '@dcl/sdk/ecs'
import { getUserData } from '~system/UserIdentity';
import { addClues } from './ui';
import { addLandscape } from './landscape';
import { addMarbles } from './marbles';

export function main() {
  
  addLandscape();
  addClues();

  executeTask(async () => {
    
    let userData = await getUserData({})
    addMarbles(userData, 4, 'models/marble.glb')

  });
}

