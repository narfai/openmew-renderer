/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * Copyright (C) 2019 François Cadeillan <francois@azsystem.fr>
 *
 */

import ospec from 'ospec';
global.window = require("mithril/test-utils/browserMock.js")();
global.document = window.document;

import './action/action.test';

ospec.run();
/** As Library consumer, i can render my application from store state real-time, recursively **/
/** As Library consumer, i can register needed resources at any time and without chronological order **/
/** As Library consumer, i can reuse and compose any render components easily **/
/** As Library consumer, i can reuse and compose any user actions easily **/
/** As Library consumer, i can reuse and compose any state reaction behaviors against actions **/
/** As Library consumer, i can define how an action is propagated recursively through the state tree **/
/** As Library consumer, i can define if an action is applied over current state while propagating **/

/** action **/

