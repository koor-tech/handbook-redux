---
title: Demo System Overview
---

# Demo System Overview

## Purpose

We are creating a demonstration system for three major reasons.

1. We need hands-on experience designing, building, and running distributed K8s environments using Rook Ceph for data storage. Typical "Getting Started" guides are insufficient for gaining experience with what our customers have to support.
2. We need a way to prove out use cases that the KSD supports and to show our work to customers.
3. We need a way to run meaningful experiments in an environment that can be adapted to match what customers do, or at least follow similar patterns.

The environment should support real applications that make use of data. The demo needs to be big enough and configured completely enough that it shows correct patterns -- running 4 or more nodes, spreading pods across nodes, using proper security, etc. On the other hand, we are not trying to discover the outter limits of Ceph or Rook scalability. Cost is still a consideration.

When complete, the demo system should be spun up and down through automation. In fact, the more of this kind of automation we put into KSD, but better our chances of selling to big customers.


## Features we want to showcase

This a list of specific points that the demo system needs to handle. Let's add everything we can think of to the list. If it gets long, we can organize into sublists. In any case, we will group the requirements into development milestones.

1. Include the yaml for setting up the K8s cluster.
   1. Start with a minimum for production where things work under light-to-medium loads.
   2. Would be nice to pick from a library of configuration patterns that match common use cases.
2. Use the latest KSD release to set up Rook Ceph.
   1. Great if installation is automated.
3. Add applications that represent what real users will want to do and the data those applications need.
   1. Some kind of database.
   2. A CDN serving a static website and its assets: HTML, CSS, Javascript, images.
   3. A streaming service for video, sound.
4. Show backup and recovery as one of the features of the environment, with Rook Ceph as the storage for backups.
5. ...and more... please add more ideas


## System design

**Note: This may take many iterations to work out.**

Here's a diagram of the demo system.

![Demo System Design](demo-system-design.drawio.svg)

(This is in draw.io [here](https://app.diagrams.net/#G1Es8ikJ0fN7b4BJiUpxWnaxQPSSkZK5Mg). Ask Dave if you want to collaborate or get a copy.)

Notes about the diagram:

1. The picture shows a minimum of 7 servers, including 4 servers dedicated to Ceph storage. We recommend customer use 4 nodes so that Ceph can recovery gracefully if any one node goes out.
2. Each node will have a minimum of 2 drives for basic redundancy. Most systems will have more, but never fewer.
   1. Storage nodes will always have the same number of drives, so if we add 1 drive, we're adding 4 (assuming 4 nodes).
3. What is missing from this diagram?
   1. Alex: If we want to use CephFS (filesystem) or RGW (object storage), it would introduce MDS or RGW daemons to the cluster, not necessarily on all the storage nodes as we would need to scale based on the load, though as always minimum 2 per storage type then for HA.

Does anything else need to be added to the diagram? Any corrections?

**Note: We should remember to adjust the picture as the system evolves. In fact, deviations should start as changes to this design. We should also docuemnt the things we try.**

## Implementation details

For short experiments, EC2 on AWS is attractive -- maybe. The per-hour cost is low if you only need the VM for a few hours. However, after a few days, the cost breaks even with the monthly cost of VMs from Hetzner.

From what I could tell without spending any money, Hetzner charges for the full month on provisioning. So using a VM for a few hours (just to practice or if the wrong specs are provisioned) would end up wasting money. Granted, it's a small amount per server. Times 6, times how many drives.

Better to get the design right (as least as much as we can figure out) before building.

And we'll make mistakes, so that's the cost of learning.

Some decisions:

* Provision VMs on Hetzner first.
  * We can also try AWS or GCP once things are working on Hetzner if we want to compare the hosting experience. Customers will have their own preference for hosting.
  * Pretty sure we don't want to pay for a bare metal system that we self-host.
* Let's use Ubuntu 22.04
  * It's available on Hetzner and AWS, which means it's popular.
  * It's aligned with Canonical, not RedHat. (I read something about Centos losing support? And other shenanegans.)
* We will use kubeadm, since we are building a production-style system.
* We will use CRI-O for container management because that's what K8s recommends.
* We will run a Postgres database for that part of the system because it rocks!
* For deployment, we will check out [KubeOne](https://github.com/kubermatic/kubeone)

Let's keep notes about what we try. Sort of an inventor's journal.

[Implementation Notes for original build of demo system](impl-notes-take-1)