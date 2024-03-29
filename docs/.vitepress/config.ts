import { defineConfig, DefaultTheme } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    title: 'Handbook',
    titleTemplate: ':title | Koor Technologies, Inc.',
    description: 'How we run our business',
    lastUpdated: true,
    head: [
      ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
    ],
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      logo: 'koor-logo.png',
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Company', link: '/company/' },
        { text: 'Development', link: '/engineering/development/' },
        { text: 'Product', link: '/engineering/product/' },
        { text: 'Marketing', link: '/marketing/' },
        { text: 'Support', link: '/customers/support/' },
      ],
      sidebar: [
        {
          text: 'Company',
          items: [
            { text: 'About Koor', link: '/company/' },
            { text: 'Culture', link: '/company/culture' },
            { text: 'Communication', link: '/company/communication' },
            {
              text: 'Time Off',
              link: '/company/time-off',
            },
            {
              text: 'Goals',
              items: [
                { text: '2024', link: '/company/goals/annual2024' },
                { text: '2023', link: '/company/goals/annual2023' },
              ],
            },
            {
              text: 'Employees',
              items: [
                { text: 'Who Powers Koor', link: '/company/employees/' },
                { text: '1-on-1s', link: '/company/employees/1on1s' },
                { text: 'On-boarding', link: '/company/employees/onboarding' },
                { text: 'Performance', link: '/company/employees/performance' },
              ],
            },
          ],
        },
        {
          text: 'Engineering',
          link: '/engineering/',
          items: [
            {
              text: 'Product Planning',
              link: '/engineering/product/',
              items: [
                {
                  text: 'Product Roadmap',
                  link: '/engineering/product/product-roadmap',
                },
              ],
            },
            {
              text: 'Development',
              items: [
                { text: 'Overview', link: '/engineering/development/' },
                {
                  text: 'Project Owners',
                  link: '/engineering/development/project-owner',
                },
                {
                  text: 'Linear Guidelines',
                  link: '/engineering/development/linear-guidelines',
                },
                {
                  text: 'Progress Reviews',
                  link: '/engineering/development/show-and-tell',
                },
                {
                  text: 'Release Management',
                  items: [
                    {
                      text: 'Procedures',
                      link: '/engineering/development/release-management',
                    },
                    {
                      text: 'Release Checklist',
                      link: '/engineering/development/release-checklist',
                    },
                  ],
                },
                {
                  text: 'Infrastructure',
                  link: '/engineering/development/infrastructure',
                },
              ],
            },
            {
              text: 'Quality',
              link: '/engineering/quality/',
            },
            {
              text: 'Demo System',
              items: [
                {
                  text: 'Overview',
                  link: '/engineering/demo/',
                },
                {
                  text: 'Installing KDCC',
                  link: '/engineering/demo/installing-kdcc.md',
                },
              ],
            },
            {
              text: 'System Operations',
              link: '/engineering/systemops/',
            },
          ],
        },
        {
          text: 'Customer Success',
          link: '/customers/',
          items: [
            {
              text: 'Support',
              link: '/customers/support/',
              items: [
                { text: 'Tracking Hours', link: '/customers/support/tracking' },
                { text: 'Assessments', link: '/customers/support/assessments' },
                {
                  text: 'Customer Calls',
                  link: '/customers/support/customer-calls',
                },
                {
                  text: 'Keeping in Touch',
                  link: '/customers/support/keeping-in-touch',
                },
                {
                  text: 'Performance Tuning',
                  link: '/customers/support/performance-tuning',
                },
                {
                  text: 'Troubleshooting',
                  link: '/customers/support/troubleshooting',
                },
              ],
            },
          ],
        },
        {
          text: 'Marketing',
          link: '/marketing/',
          items: [
            { text: 'Branding', link: '/marketing/branding' },
            {
              text: 'Social Media',
              link: '/marketing/social-media',
            },
            {
              text: 'Strategy for Adoption',
              link: '/marketing/strategy-for-adoption',
            },
          ],
        },
        {
          text: 'Sales',
          link: '/sales/',
          items: [
            { text: '2024 Targets', link: '/sales/targets-2024' },
          ]
        },
        {
          text: 'Security',
          link: '/security/',
        },
      ],

      socialLinks: [
        { icon: 'github', link: 'https://github.com/koor-tech' },
        {
          icon: 'linkedin',
          link: 'https://www.linkedin.com/company/koor-technologies-inc/',
        },
        { icon: 'twitter', link: 'https://twitter.com/koor_tech' },
      ],

      footer: {
        message: 'MIT License',
        copyright: 'Copyright © 2022-present Koor Technologies, Inc.',
      },
    },
    markdown: {
      xhtmlOut: true,
      breaks: true,
      linkify: true,
      typographer: true,
    },
  })
)
