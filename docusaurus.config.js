module.exports = {
  title: 'hamlet',
  tagline: 'Opinionated, ConfigFirst DevOps for everyone.',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'hamlet', // Usually your GitHub org/user name.
  projectName: 'hamlet', // Usually your repo name.
  themeConfig: {
    disableDarkMode: true,
    navbar: {
      title: 'hamlet',
      logo: {
        alt: 'hamlet',
        src: 'img/icon.svg',
      },
      links: [
        {to: 'docs/index', label: 'docs', position: 'left'},
        {to: 'blog', label: 'releases', position: 'left'},
        {to: 'https://github.com/orgs/hamlet-io/projects/4', label: 'roadmap', position: 'right'},
        {to: "https://hamlet.io/docs/developer-guides/index", label: 'contribute', position: 'right'},
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
              to: 'docs/getting-started/overview',
            },
            {
              label: 'Create',
              to: 'docs/tutorials/overview',
            },
            {
              label: 'Deploy',
              to: 'docs/tutorials/overview',
            },
            {
              label: 'Upgrade',
              to: 'docs/tutorials/overview',
            },
            {
              label: 'Automate',
              to: 'docs/tutorials/overview',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Latest Releases',
              to: 'blog',
            },
            {
              label: 'Gitter',
              href: 'https://gitter.im/hamlet-io/community',
            }
          ],
        },
        {
          title: 'Repos',
          items: [
            {
              label: 'Overview',
              href: 'https://hamlet.io/docs/developer-guides/index'
            },
            {
              label: 'Docs (this site)',
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
