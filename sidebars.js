module.exports = {
  docs: [
    'welcome',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'getting-started/index',
        'getting-started/install',
        'getting-started/create-cmdb',
        {
          type: 'category',
          label: 'AWS Serverless',
          items : [
            'getting-started/aws-serverless/index',
            {
              type: 'category',
              label: 'Deploy Baseline',
              items: [
                'getting-started/aws-serverless/deploy-baseline/account-bootstrap',
                'getting-started/aws-serverless/deploy-baseline/environment-bootstrap',
              ]
            },
            {
              type: 'category',
              label: 'Deploy Container',
              items: [
                'getting-started/aws-serverless/deploy-container/hamlet-hello-api',
                'getting-started/aws-serverless/deploy-container/loadbalancer-deployment',
                'getting-started/aws-serverless/deploy-container/configure-api',
              ]
            },
            {
              type: 'category',
              label: 'Deploy App',
              items: [
                'getting-started/aws-serverless/build-app/build-locally',
                'getting-started/aws-serverless/build-app/create-app-image',
                'getting-started/aws-serverless/build-app/deploy-app-image',
              ]
            },
            {
              type: 'category',
              label: 'Operations',
              items: [
              ]
            }
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'How-To',
      items: [
        {
          type: 'category',
          label: 'Cloud Providers',
          items: [
            'how-to/cloud-providers/authentication'
          ]
        },
        {
          type: 'category',
          label: 'Engine',
          items : [
            'how-to/engine/plugins',
            'how-to/engine/validate'
          ]
        },
        {
          type: 'category',
          label: 'Jenkins CI/CD',
          items: [
              'how-to/jenkins/index',
              {
                type: 'category',
                label: 'Example Library',
                items: [
                  'how-to/jenkins/examplelibrary/index',
                  'how-to/jenkins/examplelibrary/examples/properties/properties',
                  {
                    type: 'category',
                    label: 'Build',
                    items: [
                      'how-to/jenkins/examplelibrary/examples/build/single',
                      'how-to/jenkins/examplelibrary/examples/build/multiunit',
                    ]
                  },
                  {
                    type: 'category',
                    label: 'Deploy',
                    items: [
                      'how-to/jenkins/examplelibrary/examples/deploy/continuous-deploy',
                      'how-to/jenkins/examplelibrary/examples/deploy/promote-release',
                      'how-to/jenkins/examplelibrary/examples/deploy/prepare-release',
                      'how-to/jenkins/examplelibrary/examples/deploy/deploy-release',
                      'how-to/jenkins/examplelibrary/examples/deploy/accept-release',
                    ]
                  },
                  {
                    type: 'category',
                    label: 'Manage',
                    items: [
                      'how-to/jenkins/examplelibrary/examples/manage/environment',
                    ]
                  },
                  {
                    type: 'category',
                    label: 'Utilities',
                    items: [
                      'how-to/jenkins/examplelibrary/examples/utils/publish-expo-app',
                      'how-to/jenkins/examplelibrary/examples/utils/pull-image',
                      'how-to/jenkins/examplelibrary/examples/utils/run-task',
                    ]
                  }
                ]
            }
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'In Depth',
      items: [
        {
          type: 'category',
          label: 'Architecture',
          items: [
            'in-depth/architecture/architecture',
          ]
        },
        {
          type: 'category',
          label: 'Foundations',
          items: [
            'in-depth/foundations/anatomy',
            'in-depth/foundations/architecture',
            {
              type: 'category',
              label: 'Inputs',
              items: [
                'in-depth/foundations/inputs/inputsources',
                'in-depth/foundations/inputs/references',
              ]
            },
            'in-depth/foundations/outputtypes',
            'in-depth/foundations/links',
            'in-depth/foundations/profiles',
            'in-depth/foundations/lifecycle',
            'in-depth/foundations/terminology',
          ]
        },
        {
          type: 'category',
          label: 'Layers',
          items: [
            'in-depth/layers/intro',
            'in-depth/layers/tenant',
            'in-depth/layers/account',
            'in-depth/layers/product',
            'in-depth/layers/blueprint',
          ]
        },
        {
          type: 'category',
          label: 'Contribute',
          items: [
            {
              type: 'category',
              label: 'Structure',
              items: [
                {
                  type: 'category',
                  label: 'Engine',
                  items: [
                    'in-depth/contribute/structure/engine/deploymentlevels',
                    'in-depth/contribute/structure/engine/fragments',
                    'in-depth/contribute/structure/engine/legacy',
                    'in-depth/contribute/structure/engine/occurrence',
                    'in-depth/contribute/structure/engine/logging',
                    'in-depth/contribute/structure/engine/openapi',
                  ]
                },
                {
                  type: 'category',
                  label: 'Executor',
                  items: [
                    'in-depth/contribute/structure/executor/executor',
                    'in-depth/contribute/structure/executor/templates',
                    'in-depth/contribute/structure/executor/credentials',
                    'in-depth/contribute/structure/executor/crypto',
                    'in-depth/contribute/structure/executor/deployment',
                    'in-depth/contribute/structure/executor/automation',
                  ]
                },
                {
                  type: 'category',
                  label: 'Providers',
                  items: [
                    'in-depth/contribute/structure/providers/overview',
                    'in-depth/contribute/structure/providers/shared',
                    'in-depth/contribute/structure/providers/aws',
                    'in-depth/contribute/structure/providers/azure',
                    'in-depth/contribute/structure/providers/services',
                  ]
                },
                {
                  type: 'category',
                  label: 'Deployment Frameworks',
                  items: [
                    'in-depth/contribute/structure/df/overview',
                    'in-depth/contribute/structure/df/default',
                    'in-depth/contribute/structure/df/models',
                    {
                      type: 'category',
                      label: 'Outputs',
                      items: [
                        'in-depth/contribute/structure/df/outputs/overview',
                        'in-depth/contribute/structure/df/outputs/default',
                        'in-depth/contribute/structure/df/outputs/contracts',
                        'in-depth/contribute/structure/df/outputs/scripts',
                      ]
                    },
                  ]
                },
                {
                  type: 'category',
                  label: 'Data Types',
                  items: [
                    'in-depth/contribute/structure/data_types/overview',
                    'in-depth/contribute/structure/data_types/blueprint',
                    'in-depth/contribute/structure/data_types/command-line-options',
                    'in-depth/contribute/structure/data_types/definition',
                    'in-depth/contribute/structure/data_types/masterdata',
                    'in-depth/contribute/structure/data_types/seed',
                    'in-depth/contribute/structure/data_types/setting',
                    'in-depth/contribute/structure/data_types/stack-output',
                  ]
                },
              ]
            },
            {
              type: 'category',
              label: 'Tools',
              items: [
                'in-depth/contribute/tools/cli',
                {
                  type: 'category',
                  label: 'Docker',
                  items: [
                    'in-depth/contribute/tools/docker/images',
                    'in-depth/contribute/tools/docker/scripts',
                  ]
                },
                {
                  type: 'category',
                  label: 'Site',
                  items: [
                    'in-depth/contribute/tools/site/docusaurus',
                    'in-depth/contribute/tools/site/documentation',
                    'in-depth/contribute/tools/site/blogs-and-releases',
                    'in-depth/contribute/tools/site/react-components',
                  ]
                },
                {
                  type: 'category',
                  label: 'Patterns',
                  items: [
                    'in-depth/contribute/tools/patterns/patterns'
                  ]
                },
                {
                  type: 'category',
                  label: 'Jenkins',
                  items: [
                    'in-depth/contribute/tools/jenkins/jenkins',
                  ]
                },
              ]
            },
            {
              type: 'category',
              label: 'Contributor Reference',
              items: [
                'in-depth/contribute/contributor_reference/definitions',
                'in-depth/contribute/contributor_reference/macros-and-functions',
                'in-depth/contribute/contributor_reference/routines',
              ]
            },
            {
              type: 'category',
              label: 'Releases',
              items: [
                'in-depth/contribute/releases/schedule'
              ]
            },
          ]
        },
      ]
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        {
          type: 'link',
          label: 'Blueprint Reference',
          href: '/reference',
        },
        {
          type: 'category',
          label: 'Software Reference',
          items: [
            'reference/software/index',
            'reference/software/engine/engine',
            'reference/software/engine/engine_core',
            'reference/software/python_executor/cli',
            'reference/software/bash_executor/executor',
            'reference/software/docker_container/container',
          ]
        }
      ]
    }
  ]
}
