/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import { Identity} from './identity';

/*eslint no-console: "off"*/
export class Utility {
  static debug(transducer, name = ''){
      return Identity.state_reducer((next, state = null, action = {}) => {
          console.groupCollapsed(name + ' against ' + action.type);
          console.log('dispatching', action);
          console.log('state', state);
          const next_state = transducer(next)(state, action);
          console.log('next_state', state);
          console.log('propagate to', state.children.filter(
              (subState) => Identity.allow_propagation(subState, action) === true
          ).map(({ id }) => id));
          console.log('reduction allowed', Identity.allow_reduction(state, action));
          console.groupEnd();

          return next_state;
      });
  }
}

Utility.logger = Identity.state_reducer((next, state = null, action = {}) => {
    console.group(action.type);
    console.info('dispatching', action);
    console.log('state', state);
    const next_state = next(state, action);
    console.log('next state', next_state);
    console.log('reducted', next_state !== state);
    console.log('propagated', next_state.children !== state.children);
    console.groupEnd();
    return next_state;
});
