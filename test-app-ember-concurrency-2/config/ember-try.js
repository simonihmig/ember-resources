'use strict';

const getChannelURL = require('ember-source-channel-url');
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup');

module.exports = async function () {
  return {
    usePnpm: true,
    scenarios: [
      {
        name: 'ember-3.28',
        npm: {
          devDependencies: {
            'ember-source': '~3.28.0',
          },
        },
      },
      {
        name: 'ember-4.0.0',
        npm: {
          devDependencies: {
            'ember-source': '~4.0.0',
          },
        },
      },
      {
        name: 'ember-4.4',
        npm: {
          devDependencies: {
            'ember-source': '~4.4.0',
          },
        },
      },
      {
        name: 'ember-4.8',
        npm: {
          devDependencies: {
            'ember-source': '~4.8.0',
          },
        },
      },
      {
        name: 'ember-4.12',
        npm: {
          devDependencies: {
            'ember-source': '~4.12.0',
          },
        },
      },
      {
        name: 'ember-concurrency-2',
        npm: {
          devDependencies: {
            'ember-concurrency': '^2.2.1',
            'ember-concurrency-ts': '^0.3.1',
          },
        },
      },
      {
        name: 'ember-concurrency-3',
        npm: {
          devDependencies: {
            'ember-concurrency': '^3.0.0',
          },
        },
      },
      {
        name: 'ember-release',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release'),
          },
        },
      },
      {
        name: 'ember-beta',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('beta'),
          },
        },
      },
      {
        name: 'ember-canary',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('canary'),
          },
        },
      },
      embroiderSafe({
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release'),
          },
        },
      }),
      embroiderOptimized({
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release'),
          },
        },
      }),
    ],
  };
};
