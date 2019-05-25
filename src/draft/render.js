import m from 'mithril';
import { Spread, Action } from '../state/action';

const ALLOWED_LIFECYCLE = ['oncreate', 'onupdate', 'onbeforeremove', 'onremove'];

export const component_creator = ({ view = null, controller = null, lifecycle = {}}) =>
    (container) =>
        (
            (expose) => ({
                'view': view !== null
                    ? view
                    : () => m('#'),
                'oninit': function(initial_vnode){
                    if(controller !== null) controller.call(this, expose, initial_vnode);
                    return Object.assign(this, expose, {
                        'store_state': container.store.getState()
                    });
                },
                'onupdate': function(vnode){
                    this.store_state = container.store.getState();
                    if(
                        typeof lifecycle.onupdate !== 'undefined'
                        && lifecycle.onupdate !== null
                    ) lifecycle.onupdate(vnode, expose);
                },
                'onbeforeupdate': function(vnode, old_vnode){
                    const now_state = container.store.getState();
                    const choice = old_vnode.state.store_state !== now_state
                        || (
                            typeof lifecycle.onbeforeupdate !== 'undefined'
                            && lifecycle.onbeforeactivate !== null
                            && lifecycle.onbeforeupdate(vnode, old_vnode, expose)
                        );
                    this.store_state = now_state;
                    return choice;
                },
                ...Object.keys(lifecycle)
                    .filter((key) => ALLOWED_LIFECYCLE.includes(key))
                    .reduce((comp, key) => (comp[key] = lifecycle[key], lifecycle), {})
            })
        )({
            registry,
            container,
            'spread': Spread,
            'action': Action
        })
;
