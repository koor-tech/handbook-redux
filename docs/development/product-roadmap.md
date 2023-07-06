---
title: Product Roadmap
---

# Product Roadmap

## You are here

The Koor Storage Distribution includes features that work on top of Rook and Ceph to enhance the experience of storage professionals. Today, the KSD functionality includes the following:

* Koor Storage Distribution (KSD)
  * Bundles latest stable release of Rook with additional tools from Koor
  * A KSD license includes authorization to use everything in this list
* Koor Operator
  * Installs KSD on any Kubernetes cluster, and sets up Rook Ceph storage
  * Uses Helm chart or CRDs to define storage
  * Checks the status of storage
* Diagnostic scripts
  * Gathers debugging information that is useful for troubleshooting issues in a Rook Ceph cluster
* Extended Ceph Exporter
  * Extends metrics exported from Promethius for improved utilization charts

### Releases

* [Koor Operator v0.2.0](https://github.com/koor-tech/koor-operator/releases/tag/koor-operator-0.2.0)
* [Extended Ceph Exporter v1.2.8](https://github.com/koor-tech/extended-ceph-exporter/releases/tag/extended-ceph-exporter-1.2.8)
* [Koor gather info scripts](https://github.com/koor-tech/koor-gather-info)


## Work in progress

The Koor team is working on 2 new features for the Koor Operator

* Version update notifications -- issues an alert when a newer version of Ceph is available
* Automated upgrades -- if there is a newer version of Ceph, upgrades your cluster (waits for user to initiate)


## Future

We are always looking for more ways to make running Rook Ceph storage in Kubernetes easier. Here are a few of the ideas we are thinking about for 2023.

* Koor Dashboard
  * Rook Ceph cluster visualization
  * See your data cluster configuration in a browser
  * Click on each component to see configuration and operational characteristics
* Storage System Builder
  * Start from one of the basic templates that match common use cases
  * Adjust configuration options through a GUI
  * One-click cluster provisioning and adjustments
  * Integrates with Koor Dashboard
* Security Tools
  * Set up SSO access to underlying Ceph cluster
* Troubleshooting Tools
  * Performance tuning support


## Future future

* Storage System Builder
* Backup and recovery
  * Select data to back up, select a storage target, and schedule
* Troubleshooting Tools
  * Gap analysis - search Rook and Ceph features to find mismatches, identify what may be missing
