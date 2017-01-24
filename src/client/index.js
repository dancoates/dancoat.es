// why tree shaking don't work
// https://github.com/webpack/webpack/issues/2867

import Inferno from 'inferno';
import {thing1} from './test';
console.log('woot');
thing1();


Inferno.render(<div>woot</div>, document.getElementById('app'));
