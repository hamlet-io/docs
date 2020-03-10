
module.exports = {
  docs: [
    {
      type: 'doc',
      id: 'index',
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/overview',
        'getting-started/getting-started-01',
        'getting-started/getting-started-02',
        'getting-started/getting-started-03',
        'getting-started/getting-started-04',
        'getting-started/getting-started-05',
      ]
    },
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        'tutorials/overview',
        {
          type: 'category',
          label: 'Create',
          items: [
            {
              type: 'category',
              label: 'hello hamlet!',
              items: [
                'tutorials/create/multi/hello-hamlet',
              ]
            },
            {
              type: 'category',
              label: 'a single-page-app in AWS',
              items: [
                'tutorials/create/aws/guide-1-1',
                'tutorials/create/aws/guide-1-2',
                'tutorials/create/aws/guide-2-1',
                'tutorials/create/aws/guide-2-2',
              ]
            },
            {
              type: 'category',
              label: 'a django app in Azure',
              items: [
                'tutorials/create/azure/guide-1-1',
                'tutorials/create/azure/guide-1-2',
                'tutorials/create/azure/guide-2-1',
                'tutorials/create/azure/guide-2-2',
              ]
            },
            {
              type: 'category',
              label: 'a cloud rube-goldberg',
              items: [
                'tutorials/create/multi/guide-1-1'
              ]
            }
          ]
        },
        {
          type: 'category',
          label: 'Deploy',
          items: [
            'tutorials/deploy/single-deployment-unit-1-1',
            'tutorials/deploy/all-deployment-units-1-1'
          ]
        },
        {
          type: 'category',
          label: 'Upgrade',
          items: [
            'tutorials/upgrade/single-deployment-unit-1-1',
            'tutorials/upgrade/all-deployment-units-1-1'
          ]
        },
        {
          type: 'category',
          label: 'Automate',
          items: [
            'tutorials/automate/automate-upgrades-1-1'
          ]
        }
      ]
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'architecture/index'
      ]
    },
    {
      type: 'category',
      label: 'Contributor Guides',
      items: [
        'developer-guides/index',
        'developer-guides/release-schedule',
        'developer-guides/aws-data-pipeline',
      ]
    },
    {
      type: 'category',
      label: 'Examples',
      items: [
        'examples/spa-azure',
        'examples/django-app-aws',
        'examples/big-data-analytics-aws'
      ]
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        {
          type: 'category',
          label: 'CMDB',
          items: [
            'reference/cmdb/cmdb-folder-structure-01',
            'reference/cmdb/cmdb-folder-structure-02'
          ]
        },
        'reference/component-reference',
        'reference/glossary',
      ]
    },
  ]
}