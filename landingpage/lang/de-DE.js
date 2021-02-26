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
        "Stratbook won't make you win every game.\n But at least it will keep your strats and nades organized.",
      btnOpenApp: 'Open App',
      btnRegister: 'Register',
    },
  },
  faq: {
    headline: 'Frequently asked Questions.',
    questions: [
      {
        id: 'confirm-email',
        questionText: "I didn't receive my confirmation email?",
        answerText:
          "Sadly, Microsoft mail servers seem to filter out stratbook confirmation mails before they can reach your inbox.<br>If you're using a Microsoft email (hotmail.com, live.com, hotmail.de etc.), please send me a message via twitter or email (support@stratbook.live) and I will manually confirm your account.",
      },
      {
        id: 'long-term',
        questionText:
          "I'm thinking about maintaining all my strats in stratbook, but I'm worried that the service won't be up for long?",
        answerText:
          'I can guarantee you, that stratbook will be a long term project that will get long term updates and support.',
      },
      {
        id: 'feature-requests',
        questionText: 'Where can I report bugs or request new features?',
        answerText:
          'First of all, I\'m very thankful for everyone who is taking their time to report bugs and provides valuable feedback.<br>The best way is to use the "Feedback" button in the navigation drawer of the app. If you have a Github account, you can open an issue on the projects repository. You can also always send me a DM on twitter.',
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
          'Stratbook is so called "Free and Open Source Software". Using the code and hosting the service yourself will always be free.<br>The prehosted service at "app.stratbook.live" is also currently free. I\'m not planning to make a profit from this, so there only might be a light monetization at a later stage to cover hosting and domain costs.',
      },
      {
        id: 'server-down',
        questionText: 'What if Stratbook servers are down?',
        answerText:
          "Stratbook is hosted on Amazon Web Services, so downtimes are extremely unlikely. I'm working on implementing PWA (Progressive Web App) Support, which allows you to install Stratbook locally and even use it offline without internet. Strats and nades are then updated once you have a connection again.",
      },
      {
        id: 'self-host',
        questionText: 'Can I host Stratbook myself?',
        answerText:
          'You can absolutely host Stratbook yourself. There is currently no guide on setting it up and installing prerequesites but I will write one in the future.',
      },
      {
        id: 'whos-behind',
        questionText: 'Who is behind this project?',
        answerText:
          "Hi there! I'm Justin, a 24 year old web engineer & esports enthusiast based in Stuttgart, Germany. I played CSGO in the german amateur scene for a few years and started developing Stratbook in my freetime during Covid-19.<br>But you, too, could be behind this project! Drop me a message if you're interested in collaborating or helping out.",
      },
    ],
  },
  legal: {
    headline: 'Impressum',
  },
  changelog: {
    headline: 'Changelog',
    changes: [
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
        date: '2021-02-02',
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
