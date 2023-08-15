---
title: Product Roadmap
---

# Product Roadmap


**Last updated:** 14 August 2023

## Past to Now

Koor's primary product offering has been the Koor Storage Distribution (KSD). Strictly speaking, KSD is a fork of Rook with a handful of helpful scripts and documents added to the mix. More broadly, KSD includes a loosely organized set of features that enhance the experience of using Rook and Ceph for self-managed data storage. 

### What we have called KSD

* Koor Storage Distribution (KSD)
  * A fork of Rook that is kept at parity with the latest version.
* Koor Operator
  * Installs KSD on any Kubernetes cluster, and sets up Rook Ceph storage
  * Uses Helm chart or CRDs to define storage
  * Checks the status of storage, flagging the user of resources that are configured below minimum thresholds
* Diagnostic scripts
  * Gathers debugging information from a running cluster for troubleshooting issues
* Extended Ceph Exporter
  * Extends metrics exported from Promethius for improved utilization charts
* Version service
  * Checks for newer version of Ceph and Rook that could be adopted

### No adoption so far

The real problem with what we have offered so far is that have had zero adoption that we know about. Perhaps a few have used the Koor Operator without our knowledge. Maybe some have taken a look. Either KSD was not well understood or the benefits were not useful enough to be worth the trouble of adopting or even trying it.

Our customers to date are those who sought help with issues using Rook and Ceph. We are able to resolve issues and recommend improvements, so that has worked out. We need a much larger customer base, and we need customers to use our products.


## Next

Our new product strategy is to offer a single, multi-faceted product. For now as a working title, let's call it the Koor Data Control Center (KDCC). That's what we are building and offering, even though we may try different names in our marketing and sales packaging.

Simply put, the KDCC is everything you need to see what is happening with your data storage systems and to change the system as needed. It's a single-pane-of-glass view that provides a common user interfaces for many perspectives of data storage operation. It is also offers GUI-based controls for setting up data storage, for tuning a running system, and to assist with larger modifications, like upgrades, expansion, and migrations.

The components and features of the KDCC include the following.

### Koor Dashboard

* A top-level view that shows critical system metrics and active alerts.
* High-level operational charts with drill-downs to see the details of each subsystem.
* Versions of Ceph, Rook, and installed extensions, with information about available updates.

### Koor Controls

* Control panels with editable fields for properties that can be modified.
* Staging for changes that require restart.
* Scrubbing schedules to ensure deep scrubbing happens frequently enough.

### Data Storage Set-up

* Koor Operator and Helm chart for installing the Koor Storage Distribution.
* A selection of templates to match common use cases.
* Automated system upgrades.
* SSO integration.

### Troubleshooting Tools

* Diagnostic scripts to gather data to help pinpoint issues.


## MVP

We do not know what a minimum-viable product is. We have to keep adding features until rates of adoption start to soar. 

Rather than worrying about predicting an MVP, let's focus on choosing the next best feature to add and making that as valuable as possible.


## Timeline

We have to hurry. It is critical to put together a functioning alpha version of the KDCC by the end of August, which is about 15 calendar days away. The alpha does not have to do much other than serve as a good basis to continue adding features and functionality for the coming months.

Once the architecture has been reviewed, and we select an initial feature set and define development tasks in Linear. This needs to be our top priority.
