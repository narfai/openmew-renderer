module.exports = {
    'container': ({ id, resource, consumer_state = {}, containers = [] }) => ({
        id,
        resource,
        consumer_state,
        containers
    }),
    'blueprint': ({ resource, view = null, reducer = null, controller = null, containers_reducer = null, lifecycle = {} }) => ({
        resource,
        view,
        reducer,
        controller,
        containers_reducer,
        lifecycle
    })
};
