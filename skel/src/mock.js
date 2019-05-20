/*DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 Version 2, December 2004

 Copyright (C) 2017 Francois Cadeillan <francois@azsystem.fr>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

 DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

 0. You just DO WHAT THE FUCK YOU WANT TO.
 */

export const mock = {
    'id': 'jvs2qy94',
    'resource': 'Application.Main',
    'consumer_data': {
        'prefix': 'My',
        'name': 'application test'
    },
    'containers': [
        {
            'id': 'jsvs2qz18',
            'resource': 'Application.Hello',
            'consumer_data': {
                'text': 'CandyWorld',
                'number': 666
            },
            'containers': [
                {
                    'id': 'jvs2y66t',
                    'resource': 'Application.Hello',
                    'consumer_data': {
                        'text': 'CoolWorld',
                        'number': 777
                    },
                    'containers': [
                        {
                            'id': 'jvs2y6gi',
                            'resource': 'Application.Hello',
                            'consumer_data': {
                                'text': 'LollyWorld',
                                'number': 888
                            },
                            'containers': [
                                {
                                    'id': 'jvs2y6y4',
                                    'resource': 'Application.Hello',
                                    'consumer_data': {
                                        'text': 'CookieWorld',
                                        'number': 999
                                    }
                                },
                                {
                                    'id': 'jvs2y724',
                                    'resource': 'Application.Hello',
                                    'consumer_data': { 'text': 'PrettyWorld', 'number': 1111 }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            'id': 'jvs2y6by',
            'name': 'CreepyWorld',
            'resource': 'Application.Hello',
            'consumer_data': { 'text': 'CreepyWorld', 'number': 888 }
        }
    ]
};

export default mock;
