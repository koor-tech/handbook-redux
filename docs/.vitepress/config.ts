import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    title: 'Koor Handbook',
    titleTemplate: ':title | Koor Technologies, Inc.',
    description: 'How we run our business',
    head: [
      ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
    ],
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      logo: 'koor-logo.png',

      nav: [
        { text: 'Home', link: '/' },
        { text: 'Company', link: '/company/' },
        { text: 'Employees', link: '/employees/' },
        { text: 'Development', link: '/development/' },
        { text: 'Support', link: '/consulting/' },
        { text: 'Examples', link: '/markdown-examples' },
      ],

      sidebar: [
        {
          text: 'Company',
          items: [
            { text: 'About Koor', link: '/company/' },
            { text: 'Culture', link: '/company/culture' },
            { text: 'Communication', link: '/company/communication' },
            {
              text: 'Operating Procedures',
              link: '/company/operating-procedures',
            },
            {
              text: 'Goals',
              link: '/company/goals/',
              items: [
                {
                  text: '2023',
                  link: '/company/goals/annual2023',
                },
                {
                  text: 'June 2023',
                  link: '/company/goals/june2023',
                },
                {
                  text: 'July-Aug 2023',
                  link: '/company/goals/july-aug2023',
                },
              ],
            },
            {
              text: 'Marketing',
              link: '/company/marketing/',
              items: [
                { text: 'Branding', link: '/company/marketing/branding' },
                {
                  text: 'Social Media',
                  link: '/company/marketing/social-media',
                },
                {
                  text: 'Strategy for Adoption',
                  link: '/company/marketing/strategy-for-adoption',
                },
              ],
            },
          ],
        },
        {
          text: 'Employees',
          items: [
            { text: 'Who Powers Koor', link: '/employees/' },
            { text: '1-on-1s', link: '/employees/1on1s' },
            { text: 'Performance', link: '/employees/performance' },
          ],
        },
        {
          text: 'Development',
          items: [
            {
              text: 'Product Roadmap',
              link: '/development/product-roadmap',
            },
            { text: 'Development Practices', link: '/development/' },
            {
              text: 'Release Management',
              items: [
                {
                  text: 'Procedures',
                  link: '/development/release-management',
                },
                {
                  text: 'Release Checklist',
                  link: '/development/release-checklist',
                },
              ],
            },
            { text: 'Infrastructure', link: '/development/infrastructure' },
            {
              text: 'Demo System',
              items: [
                {
                  text: 'Overview',
                  link: '/development/demo/',
                },
                {
                  text: 'Vision for Demo System',
                  link: '/development/demo/demo-system-mindmap',
                },
                {
                  text: '1st Impl Attempt',
                  link: '/development/demo/impl-notes-take-1',
                },
              ],
            },
          ],
        },
        {
          text: 'Support',
          items: [
            { text: 'Consulting Practice', link: '/consulting/' },
            { text: 'Tracking Hours', link: '/consulting/tracking' },
            { text: 'Assessments', link: '/consulting/assessments' },
            { text: 'Customer Calls', link: '/consulting/customer-calls' },
            { text: 'Keeping in Touch', link: '/consulting/keeping-in-touch' },
            {
              text: 'Performance Tuning',
              link: '/consulting/performance-tuning',
            },
            { text: 'Troubleshooting', link: '/consulting/troubleshooting' },
          ],
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
    },
    markdown: {
      xhtmlOut: true,
      breaks: true,
      linkify: true,
      typographer: true,
    },
  })
)
