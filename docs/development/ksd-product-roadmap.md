---
title: KSD Product Roadmap
---

# KSD Product Roadmap

## Big ideas - subject to change

The Koor Storage Distribution includes features that work on top of Rook and Ceph to enhance the experience of storage professionals. Here is a look at the features in KSD today and ideas for the new features and improvement in the future. Although this represents our best intentions at the time of publishing, everything here is subject to change.

## Feature areas

### Koor Operator

| Feature   |   State   | Description                     |
| --------- |   :---:   | ------------------------------- |
| Installing rook | [0.2.0 released](https://github.com/koor-tech/koor-operator/releases/tag/koor-operator-0.2.0) | Installs rook and checks if the cluster resources match recommendations |
| Version update notifications | in development |  sends a notification whenever a new version of rook or ceph is released and ready for use |
| Automated Ceph upgrades | future | Automatically upgrades the cluster to the latest available version of rook or ceph |


### Security

| Feature   |   State   | Description                     |
| --------- |   :---:   | ------------------------------- |
| SSO Setup | released | Instructions for setting up SSO |


### Troubleshooting tools

| Feature   |   State   | Description                     |
| --------- |   :---:   | ------------------------------- |
| Extended Ceph Exporter | [1.2.8 released](https://github.com/koor-tech/extended-ceph-exporter/releases/tag/extended-ceph-exporter-1.2.8) | Prometheus exporter to provide "extended" metrics about a Ceph cluster's running components |
| Gather Info | public | [unreleased] Scripts to collect Ceph operational data to understand performance characteristics of the system |

