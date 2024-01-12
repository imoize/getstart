// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const {themes} = require('prism-react-renderer');
const lightTheme = themes.github;
const darkTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Imoize',
  tagline: 'Hope Right As Rain',
  favicon: 'img/favicon.ico',
  noIndex: false, // Defaults to `false`

  // Set the production url of your site here
  url: 'https://imoize.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/getstart/',
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'imoize', // Usually your GitHub org/user name.
  projectName: 'getstart', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          // routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          lastVersion: 'current',
          onlyIncludeVersions: ['current'],
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        appId: 'N7IJ6XT1ID',
        apiKey: 'e5bc65c5fa223bf84b7f0d9536ef350a',
        indexName: 'getstart',
        contextualSearch: true,
      },
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Imoize',
        hideOnScroll: true,
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo-256x256.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Docs',
            className: 'docs-title',
            // activeBaseRegex: `/`,
          },
          {
            to: 'docker-swarm',    // ./docs-api/Intro.md
            sidebarId: 'dockerswarm',
            label: 'Docker Swarm',
            position: 'left',
            // activeBaseRegex: `/docker-swarm/`,
          },
          // {
          //   to: 'kubernetes',    // ./docs-api/Intro.md
          //   // sidebarId: 'dockerswarm',
          //   label: 'Kubernetes',
          //   position: 'left',
          //   activeBaseRegex: `/kubernetes/`,
          // },
          // {
          //   to: '/blog',
          //   label: 'Blog',
          //   position: 'left'
          // },
          {
            // GitHub
            href: 'https://github.com/imoize/getstart',
            // label: 'GitHub',
            position: 'right',
            className: 'header-github-link',
          },
          // {
          //   type: 'search',
          //   position: 'right',
          // },
        ],
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
          hideable: true,
        },
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} Imoize 🚀 . Built with Docusaurus.`,
      },
      prism: {
        additionalLanguages: ['bash', 'diff', 'json'],
      },
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
  }),

  plugins: [
      [
        '@docusaurus/plugin-content-docs',
        {
          id: 'dockerswarm',
          path: 'docs-docker-swarm',
          routeBasePath: 'docker-swarm',
          sidebarPath: require.resolve('./sidebars.js'),
          lastVersion: 'current',
          onlyIncludeVersions: ['current'],
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        }, 
      ],
    //   [
    //     '@docusaurus/plugin-content-docs',
    //   {
    //     id: 'kube',
    //     path: 'docs-kubernetes',
    //     routeBasePath: 'kubernetes',
    //     sidebarPath: require.resolve('./sidebars.js'),
    //     lastVersion: 'current',
    //     onlyIncludeVersions: ['current'],
    //     showLastUpdateAuthor: true,
    //     showLastUpdateTime: true,
    //   },
    // ],
  ],
};

module.exports = config;

