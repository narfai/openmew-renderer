import { controller } from './controller';
import { reducer } from './reducer';

export const Hello = {
    'id': 'Application.Hello',
    controller,
    'dataReducer': reducer
};

export default Hello;
