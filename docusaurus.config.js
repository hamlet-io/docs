module.exports = {
  title: 'hamlet',
  tagline: 'Opinionated, ConfigFirst DevOps for everyone.',
  url: 'https://docs.hamlet.io',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'hamlet-io', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  onDuplicateRoutes: 'warn',
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
        {to: 'docs/hello/welcome', label: 'docs', position: 'left'},
        {to: "blog", label: 'blog', position: 'right'},
        {
          label: 'releases',
          position: 'right',
          items: [
            {
              label: 'strategy',
              to: 'docs/releases/schedule',
            },
            {
              label: 'roadmap',
              href: 'https://github.com/orgs/hamlet-io/projects/4',
            }
          ]
        },
        {to: "https://gitter.im/hamlet-io/community", label: 'community', position: 'right'},
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
              to: 'docs/hello/hamlet',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Docs',
              to: 'docs/hello/welcome'
            },
            {
              label: 'Help',
              href: 'https://help.hamlet.io',
            },
          ],
        },
        {
          title: 'Repositories',
          items: [
            {
              label: 'Overview',
              href: 'https://docs.hamlet.io/docs/developer-guides/index'
            },
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
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  scripts: [
    {
      src: "yaml.js",
    },
    {
      src: "https://p.trellocdn.com/embed.min.js",
      async: true,
    }
  ],
};
