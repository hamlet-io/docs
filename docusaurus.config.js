// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

require('dotenv').config()

// Allow for overrides of typesense config at build time
const typesense_host = process.env.TYPESENSE_SEARCH_HOST || "docs.hamlet.io"
const typesense_protocol = process.env.TYPESENSE_SEARCH_PROTOCOL || "https"
const typesense_port = parseInt(process.env.TYPESENSE_SEARCH_PORT || "") || 443
const typesense_search_api_key = process.env.TYPESENSE_SEARCH_API_KEY || "abcdef123"
const typesense_index_name = process.env.TYPESENSE_INDEX_NAME || "docs-hamlet-io"

/** @type {import('@docusaurus/types').Config} */
const config = {
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

  markdown: {
    mermaid: true
  },

  themes: [
    '@docusaurus/theme-mermaid',
    'docusaurus-theme-search-typesense',
  ],

  themeConfig: {
    colorMode: {
      disableSwitch: false
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
      copyright: `Built with Docusaurus | Hamlet`,
    },
    prism: {
      theme: require("./src/theme/hamlet"),
      additionalLanguages: ['groovy']
    },
    typesense: {
      typesenseCollectionName: typesense_index_name,

      typesenseServerConfig: {
        nodes: [
          {
            host: typesense_host,
            port: typesense_port,
            protocol: typesense_protocol,
          }
        ],
        apiKey: typesense_search_api_key,
      }
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          // Please change this to your repo.
          editUrl: 'https://github.com/hamlet-io/docs/edit/master/',
          remarkPlugins: [],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        blog : {
          blogSidebarTitle: "All our posts",
          blogSidebarCount: "ALL",
          remarkPlugins: [],
        }
      },
    ],
  ],

};

module.exports = config;
