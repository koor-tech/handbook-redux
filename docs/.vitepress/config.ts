import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Koor Handbook :: Koor Technologies, Inc.",
  description: "How we run our business",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: 'koor-logo.png',
    
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Company', link: '/company/' },
      { text: 'Employees', link: '/employees/' },
      { text: 'Development', link: '/development/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Company', link: '/company/' },
          { text: 'Employees', link: '/employees/' },
          { text: 'Development', link: '/development/' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/koor-tech' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/company/koor-technologies-inc/' },
      { icon: 'twitter', link: 'https://twitter.com/koor_tech' },
    ]
  },
  markdown: {
    xhtmlOut: true,
    breaks: true,
    linkify: true,
    typographer: true
  }
})
