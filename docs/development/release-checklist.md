---
title: Release Checklist
---

# Release Checklist

For each release, copy these steps into a new Linear issue. Convert bullets to checkboxes. Then assign out the tasks. Check off tasks as you finish them.

If something is missing from the checklist, add it both to the issue. Also, create a Linear issue to add the item to this template. That way it won't block you, and we won't forget to improve this template for the future.

- Sync with the latest upstream Rook release
- Build the latest versions of our sub-systems
  - Koor / Rook
  - Data Control Center
  - Koor Operator
  - Version Service
  - Troubleshooting scripts
  - SSO
  - Scrubbing
- Release notes
  - Prepare release notes - a consolidated list of what is new and included in the release, with links to other release notes (rather than duplicating)
  - Publish release notes on https://github.com/koor-tech/koor/releases
- Test the release - set up an environment, and make sure our features are working against the latest Koor release
  - Koor / Rook
  - Data Control Center
  - Koor Operator
  - Version Service
  - Troubleshooting scripts
  - SSO
  - Scrubbing
- Distribute release - in sequence
  - 1. Update Docker docker images
  - 2. Update helm version (not before Docker image is updated)
- Update repositories
  - Make sure the release shows up in the repo (e.g., https://github.com/koor-tech/koor/releases)
    - does it need a tag?
  - Artifactory
  - Rancher
  - others…?
- Prepare blog post announcing the "what's new" - highlights of the release, links
- Prepare messaging for socials
  - HN - although Hacker News does not appreciate self promotion; avoid being shadow banned
  - Twitter
  - LinkedIn
- Post to blog; blast out to socials
  - HN
  - Twitter
  - LinkedIn
