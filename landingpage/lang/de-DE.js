export default {
  navbar: {
    faq: 'FAQ',
    changelog: 'Changelog',
    register: 'Register',
  },
  footer: {
    legalNotice: 'Impressum',
  },
  index: {
    hero: {
      tagline: 'Free & Open-Source Platform',
      headline: 'The best place to manage your strats and nades.',
      subline:
        'Plan out your strategies with our collaborative tactics board and keep your strategies and nades organized in one place.',
      btnOpenApp: 'Open App',
      btnRegister: 'Register',
    },
  },
  faq: {
    headline: 'Frequently asked Questions.',
    questions: [
      {
        id: 'long-term',
        questionText:
          "I'm thinking about maintaining all my strats in stratbook, but I'm worried that the service won't be up for long?",
        answerText:
          "Stratbook is a long term project that is continuously updated and improved. We've been up for over 3 years now with thousands of active users and aren't going anywhere :)",
      },
      {
        id: 'feature-requests',
        questionText: 'Where can I report bugs or request new features?',
        answerText:
          "First of all, we're very thankful for everyone who is taking their time to report bugs and provides valuable feedback.<br>The best way is to report the issue on our Discord server linked at the top. If you have a Github account, you can open an issue on the projects repository. You can also always send me a DM on twitter.",
      },
      {
        id: 'who-can-see',
        questionText: 'Who can see my strats?',
        answerText:
          'Your strats are only visible to your own team. Stratbook has good security measures in place to keep your strats safe and sound.',
      },
      {
        id: 'costs',
        questionText: 'Are there any costs or prices?',
        answerText:
          'Stratbook is totally free. If you wish to support the development and the hosting of Stratbook there is a donation button at the bottom of the page.',
      },
    ],
  },
  legal: {
    headline: 'Legal Notice',
  },
  changelog: {
    headline: 'Changelog',
    changes: [
      {
        version: '2.6.0',
        date: '2024-06-17',
        changes: [
          'Steam authentication',
          'Automatic redirect from landing page',
          'Tons of behind the scenes improvements',
        ],
      },
      {
        version: '2.5.0',
        date: '2023-09-17',
        changes: [
          'Strats can be saved from map view when a name is added.',
          'Added deeplinks to strat drawing board',
          'minor bug fixes',
        ],
      },
      {
        version: '2.4.0',
        date: '2023-05-05',
        changes: [
          'Manual sorting of strats via drag & drop',
          'Various small fixes',
        ],
      },
      {
        version: '2.3.1',
        date: '2023-04-24',
        changes: [
          'Decreased size of player icons on tactics board',
          'Youtube Shorts links can now be added to utilities',
          'Upgrade desktop app to latest chromium version',
        ],
      },
      {
        version: '2.3.0',
        date: '2023-04-19',
        changes: [
          'Player icons on tactics board',
          'Fixed minor issues with loading indicator',
          'Fixed player color not being updated correctly on tactics board',
        ],
      },
      {
        version: '2.2.1',
        date: '2023-03-27',
        changes: [
          'Handle links in strat content',
          'Fixed issue with sharing strats',
        ],
      },
      {
        version: '2.2.0',
        date: '2023-01-20',
        changes: [
          'Added a filter to hide inactive strats',
          'Fixed issue with emails not being case insensitive',
          'Fixed issue where unsaved strat content changes are lost when window is resized while editing',
        ],
      },
      {
        version: '2.1.3',
        date: '2022-12-17',
        changes: [
          'Updated ancient minimap',
          'Fixed issues on mirage minimap',
          'Fixed "last online" label for online players on team page',
        ],
      },
      {
        version: '2.1.2',
        date: '2022-11-26',
        changes: [
          'Added Anubis to the map pool',
          'Utility screenshots are displayed in their original ratio by default',
        ],
      },
      {
        version: '2.1.1',
        date: '2022-06-27',
        changes: [
          'Fix main menu not closing on mobile in certain situations',
          'Make new team page responsive',
          'Fix editing strat content on mobile',
        ],
      },
      {
        version: '2.1.0',
        date: '2022-06-25',
        changes: ['Darkmode 🎇', 'Player colors 🌈', 'New team page design'],
      },
      {
        version: '2.0.1',
        date: '2022-05-21',
        changes: ['Fix opening links & joining game server via desktop app'],
      },
      {
        version: '2.0.0',
        date: '2022-05-14',
        changes: [
          'New and improved collaborative draw board',
          'New "Map" page where the draw board can be used without an account',
          'Loading bar at the top',
          'Indicator showing if a strat has draw data',
        ],
      },
      {
        version: '1.9.2',
        date: '2022-01-24',
        changes: ['Fix de_ancient missing map in DrawTool'],
      },
      {
        version: '1.9.0',
        date: '2021-07-16',
        changes: [
          'New "Setpos" Option for utilities',
          'Multiple economy types now allowed for strats',
          'Filter state is now persisted',
          'Window size and location state is now persisted (Desktop Client)',
          'Button to invert sort direction for strats',
          'Desktop Client updates are now installed automatically',
        ],
      },
      {
        version: '1.8.6',
        date: '2021-06-09',
        changes: ['Fix DrawTool drawable area not matching map size'],
      },
      {
        version: '1.8.1',
        date: '2021-05-09',
        changes: ['Add Ancient to the mappool'],
      },
      {
        version: '1.8.0',
        date: '2021-05-08',
        changes: [
          'Add "Focus Mode", which currently hides the map picker and menu but more features are planned for the future!',
          'Make strats collapsable to improve maintainability of larger strat amounts',
          'Add shortcuts to strats view and utility view. (Documentation will follow!)',
          'Various small fixes and improvements',
        ],
      },
      {
        version: '1.7.7',
        date: '2021-04-21',
        changes: ['Auto-generate row for each player', 'Allow empty lines'],
      },
      {
        version: '1.7.6',
        date: '2021-02-26',
        changes: [
          'Add "Jumpthrow" pose option to utilities',
          'Improve utility lightbox and display utility description',
          'Add discord link to menu',
          'Improve version check on app start: Only display notice for new feature version, not patches',
          'Desktop App: Update electron to v9.4',
        ],
      },
      {
        version: '1.7.0',
        date: '2021-02-26',
        changes: [
          'Recognize & highlight timestamps',
          'Auto-transform -> to proper arrows',
          'Fix minor API vulnerability',
        ],
      },
      {
        version: '1.6.0',
        date: '2021-02-16',
        changes: [
          'Add weapon and equipment linking with new / operator (Thanks @ImbaaA_CSGO for the suggestion)',
          'Add indicator to linked utilities showing if linked utility still exists.',
          'Minor fixes',
        ],
      },
      {
        version: '1.5.0',
        date: '2021-02-12',
        changes: [
          'Release desktop app',
          'Add auto update to desktop app',
          'Remove beta key requirement during registration',
          'Selected map now saved between sessions',
        ],
      },
      {
        version: '1.4.0',
        date: '2021-02-06',
        changes: [
          'Add bomb & defuse kit as linkable options in strat editor (Thanks @enzy2k12 for the suggestion)',
          'Improved layout of team join/create page',
          'Added server logging to fix production bugs easier',
          'Added "delete Account" functionality',
        ],
      },
      {
        version: '1.3.0',
        date: '2021-02-02',
        changes: [
          'Added timestamp support to utility lightbox youtube player',
          'Fixed not being able to interact with video when extended crosshair active',
        ],
      },
      {
        version: '1.2.2',
        date: '2021-02-03',
        changes: [
          'Fixed new bug that prevented utilities from being added.',
          'Fixed error when changing team avatar',
        ],
      },
      {
        version: '1.2.0',
        date: '2021-02-02',
        changes: [
          'Utility images can now be removed.',
          'Added tutorial dialog after adding first strat.',
          "Fixed console error when teams don't have server specified.",
        ],
      },
      {
        version: '0.12.0',
        date: '2021-01-23',
        changes: [
          'Added draw tool, an interactive minimap, to all strats.',
          'Added image loading indicator',
          'Minor bugfixes',
        ],
      },
      {
        version: '0.11.0',
        date: '2021-01-20',
        changes: [
          'Added embedded youtube player to utility lightbox',
          'Adjust mobile button styling',
          'Various refactorings',
        ],
      },
      {
        version: '0.10.0',
        date: '2021-01-14',
        changes: [
          'Authorization system rework with httpOnly refreshToken cookies',
          'Sanitization on server side',
        ],
      },
    ],
  },
  register: {
    headline: 'Register',
  },
  cookieBanner: {
    headline: 'We respect your privacy',
    baseText:
      'We use necessary cookies to make our site work. With your approval we might also set up optional analytics cookies to help us improve the site.',
    labelRequired: 'Required cookies',
    labelAnalytics: 'Analytics cookies',
    btnSave: 'Save',
    btnAcceptAll: 'Accept all',
  },
};
