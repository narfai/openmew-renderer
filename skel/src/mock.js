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
    'name': 'MyApplication',
    'resource': 'Application.Main',
    'data': {
        'prefix': 'My',
        'name': 'application test'
    },
    'modules': [
        {
            'name': 'CandyWorld',
            'resource': 'Application.Hello',
            'data': {
                'text': 'CandyWorld',
                'number': 666
            },
            'modules': [
                {
                    'name': 'CoolWorld',
                    'resource': 'Application.Hello',
                    'data': {
                        'text': 'CoolWorld',
                        'number': 777
                    },
                    'modules': [
                        {
                            'name': 'LollyWorld',
                            'resource': 'Application.Hello',
                            'data': { 'text': 'LollyWorld', 'number': 888 },
                            'modules': [
                                {
                                    'name': 'CookieWorld',
                                    'resource': 'Application.Hello',
                                    'data': { 'text': 'CookieWorld', 'number': 999 }
                                },
                                {
                                    'name': 'PrettyWorld',
                                    'resource': 'Application.Hello',
                                    'data': { 'text': 'PrettyWorld', 'number': 1111 }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            'name': 'CreepyWorld',
            'resource': 'Application.Hello',
            'data': { 'text': 'CreepyWorld' }
        }
    ]
};
