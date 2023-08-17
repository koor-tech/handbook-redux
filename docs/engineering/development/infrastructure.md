---
title: Infrastructure
---

# Infrastructure

We use a central "infra" code repository to manage certain aspects of our infrastructure automatigically using various automation tools.

## Creating/ Modifiying DNS records

The infra repository should be used for that. No manual changes to DNS should be done, as they might be reverted/ removed when the "infra CI" is run again.
