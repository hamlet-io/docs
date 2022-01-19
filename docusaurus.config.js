module.exports = {
  title: 'hamlet',
  tagline: 'Deploy anywhere, at scale',
  url: 'https://docs.hamlet.io',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'hamlet-io', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  onDuplicateRoutes: 'throw',
  themeConfig: {
    colorMode: {
      disableSwitch: true
    },
    navbar: {
      title: 'hamlet',
      logo: {
        alt: 'hamlet',
        src: 'img/icon.svg',
      },
      items: [
        {to: 'blog', label: 'blog', position: 'right'},
        {to: 'https://github.com/hamlet-io/discussions/discussions', label: 'discussions', position: 'right'},
      ],
    },
    algolia: {
      apiKey: '919c25df3c384329b25098f1dcb5c5a6',
      indexName: 'hamlet',
      algoliaOptions: {},
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Guides',
          items: [
            {
              label: 'Getting Started',
              to: 'getting-started',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discussions',
              to: 'https://github.com/hamlet-io/discussions/discussions'
            },
            {
              label: 'Library',
              to: 'https://github.com/hamlet-io/hamlet-library'
            }
          ],
        },
        {
          title: 'Repositories',
          items: [
            {
              label: 'Docs',
              href: 'https://github.com/hamlet-io/docs'
            },
            {
              label: 'Engine',
              href: 'https://github.com/hamlet-io/engine',
            },
            {
              label: 'Engine Plugin: AWS',
              href: 'https://github.com/hamlet-io/engine-plugin-aws',
            },
            {
              label: 'Engine Plugin: Azure',
              href: 'https://github.com/hamlet-io/engine-plugin-azure'
            },
            {
              label: 'Executor: Bash',
              href: 'https://github.com/hamlet-io/executor-bash'
            },
            {
              label: 'Executor: Python',
              href: 'https://github.com/hamlet-io/executor-python'
            },
          ],
        },
      ],
      copyright: `Built with Docusaurus.`,
    },
    prism: {
      theme: require("./src/theme/hamlet"),
      additionalLanguages: ['groovy']
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        blog : {
          blogSidebarTitle: "All our posts",
          blogSidebarCount: "ALL",
        }
      },
    ],
  ],
};
