---
title: Demo System Overview
outline: [2, 3]
---

# Demo System Overview

## Purpose

We are creating a demonstration system for three major reasons.

### Gain experience

In order to better empathize with our customers, we need hands-on experience designing, building, and running distributed K8s environments using Rook Ceph for data storage. Typical "Getting Started" guides are insufficient for learning about production situations. Our demo system can help us understand some aspects of what our customers have to do. We can also build our skills so that we provide better support.

### Put Koor software to use

Whenever we release software, our demo system can be the first production-like system to give it a try. We can set up a variety of use cases and situations to put our software through it's paces. Plus, we will want to record videos that show our software's capabilities.

### Run experiments

Our demo system should be a great place to run experiments. Maybe we need to research the optimal configuration for a given use case. We can use our stable demo environment and isolate the change we want to explore. Also, we should be able to push things to the limit. Also, we can try out configurations that our customers are using and see if we can find a way to improve throughput or some other dimension.

## Requirements

### Hosting

We run our demo system in the cloud. Koor does not operate a data center, and we need world-wide accessibility. We prefer [Hetzner Cloud](https://www.hetzner.com/cloud) for hosting, with data centers in Europe and USA. Easy to spin up servers and add disks. Low cost -- we can leave it running for quick access and guest users. Lots of Kubernetes tooling knows about it.

### Easy setup / tear down

While we will treat a running demo system like a pet &ndash; caring for it, nurturing it, teaching it new tricks &ndash; we also need a way to spin up new demo environments quickly. It would be normal to have a primary system for customer demos and recordings. We will also want another to ensure that upgrades and other significant changes will work. Plus, if the demo system is to be a basis for experiments, we need a quick way to get started.

When complete, the demo system should be spun up and down through automation. Ideally, we will use GitOps for all demo system setup and changes. While we are setting that up and learning how to use it, we will have to rely on tools and scripts and a lot of keying things in by hand. At a minimum, we need to keep up-to-date instructions about how to install everything we need.

We have a gitops repository, [demo-gitops](https://github.com/koor-tech/demo-gitops). If you work on the demo system, please make sure your efforts are captured there.

### Sufficient resources

The environment will support real applications that make use of data. The demo needs to be big enough and configured completely enough that it shows correct usage patterns -- running 1 or 3 control plane nodes, 4 or more data nodes, spreading pods across nodes for fault tolerance, using proper security, etc.

On the other hand, we are not trying to discover the outer limits of Ceph or Rook scalability. Cost is still a major consideration.

## Features we want to showcase

We can categorize the types of features we want to highlight with our demo system.

### Kubernetes, Rook, and Ceph

Sometimes people want to copy something that works. We can have a few different flavors for the different layers of the environment.

1. Show what a normal (albeit small) production set-up looks like, with Kubernetes, Rook and Ceph running. In this case, we can treat Rook and Koor Storage Distribution (KSD) interchangeably. We cover KSD is a different category.
2. OS: Linux (Ubuntu, Debian, CentOS)
3. Networking: Calico, Cilium, Multus - these may have an impact on Ceph performance.
4. CRDs, PVs, PVCs.
5. Security: SSO, role-based access control, ingress/egress
6. This is not an exhaustive list.

### Koor products

1. Koor Data Control Center
2. Koor Operator
3. Koor Storage Distribution (KSD)
4. Koor Version Service
5. Troubleshooting tools

### Data usage patterns

1. Block storage
   1. Databases - MariaDB, Postgres
   2. Recording and streaming apps
2. Object storage
   1. S3
   2. CDN - website artifacts
      1. Images / videos
      2. Fonts
   3. Log files
   4. Backups
3. File storage
   1. ??

### System dynamics

The best demonstration will show how the system changes in response to activity and configuration updates. We should have two ways to generate activity:

- On demand by using applications and scripts that put data load on the system.
- Using simulated activity driven by bots.

We can be creative. Here are a few ideas for getting started.

1. Run [Mastodon](https://github.com/mastodon/mastodon) - this requires a Postgres database and gives us an interface for "generating" data. Plus we can have fun with it for demos.
2. Have a bot that adds and removes files from S3 buckets. Could be a short script with some randomness and a set of files to choose from. Set up a cron job to run the script every 5 minutes or so. Set some limits to avoid filling a drive and crashing the system.
3. Set up a CDN with license-free content. We can use our YouTube videos, download a collection of Google fonts, anything that we are allowed to distribute. Then host a static website or SPA from the CDN.
4. Other ideas? An example of AI?

## More information

We have a steady endpoint for our running demo system: [demo.koor.tech](https://demo.koor.tech). Ask around for the username and password.

Check out [demo-gitops](https://github.com/koor-tech/demo-gitops) for the latest configuration scripts. We should have system design docs there, too. A deployment diagram for each configuration would be good. What nodes are runnning? What is deployed on each?

Let's have instructions for setting up Koor products. For instance,

- [Installing Koor Data Control Center](./installing-kdcc)
