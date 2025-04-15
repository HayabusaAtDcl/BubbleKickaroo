import { addBubbles } from './marbles';
import { addUi } from './ui';
import { LSCQuesting } from './questing';
import { showLSCQuestIcon } from 'lsc-questing-dcl';


export function main() {

  
  //LSCQuestLocalCreator(true)
  LSCQuesting()

  showLSCQuestIcon(true)
  addUi();
  addBubbles(50, 'models/gift.glb');

}
