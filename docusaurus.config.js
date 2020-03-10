module.exports = {
  title: 'hamlet',
  tagline: 'opinionated, ConfigFirst DevOps for everyone.',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'hamlet', // Usually your GitHub org/user name.
  projectName: 'hamlet', // Usually your repo name.
  themeConfig: {
    disableDarkMode: true,
    navbar: {
      title: '',
      logo: {
        alt: 'hamlet',
        src: 'img/hamlet_navbar.png',
      },
      links: [
        {to: 'docs/index', label: 'docs', position: 'left'},
        {to: 'blog', label: 'releases', position: 'left'},
        {to: 'docs/developer-guides/release-schedule', label: 'schedule', position: 'left'},
        {to: 'https://github.com/orgs/codeontap/projects', label: 'roadmap', position: 'right'},
        {to: "contribute", label: 'contribute', position: 'right'},
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
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/doc1',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'Gitter',
              href: 'https://gitter.im/hamlet-devops/community?utm_source=share-link&utm_medium=link&utm_campaign=share-links',
            }
          ],
        },
        {
          title: 'Repos',
          items: [
            {
              label: 'Generation (Core)',
              href: 'https://github.com/codeontap/gen3',
            },
            {
              label: 'Automation',
              href: 'https://github.com/codeontap/automation',
            },
            {
              label: 'CLI',
              href: 'https://github.com/codeontap/gen3-cli'
            },
            {
              label: 'Docker',
              href: 'https://github.com/codeontap/docker-gen3'
            },
            {
              label: 'Patterns',
              href: 'https://github.com/codeontap/gen3-patterns'
            },
            {
              label: 'Freemarker Wrapper',
              href: 'https://github.com/codeontap/gen3-freemarker-wrapper'
            }
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
          editUrl:
            'https://github.com/hamlet/hamlet-docs/edit/master/website/',
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
