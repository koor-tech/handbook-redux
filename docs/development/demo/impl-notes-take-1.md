---
title: Demo system implementation - take 1
---

# Implementation Attempts - Notes

These are notes about the implementation of the demo system, defined by the [overview](index).

For now, let's try journal style to keep a record of things tried in what order. Dear diary...


## 29 June 2023

### Provisioning a server (VM)

* Adding a single VM: 3 VCPU, 4GB RAM, 80GB local SSD, 7.05 Euro / mo
  * This will be for the Control Plane
  * Other details:
    * IPv4, IPv6
    * x86
    * created SSH key

For the record, I spent (wasted) a lot of time trying to login to my new server. Maybe these tips can help someone else.

1. I created an SSH key when I provisioned the server. The private side of that key goes on your local machine.
2. Then I fussed around trying to figure out who to log in as. The answer is root. [Directions are here](https://docs.hetzner.com/cloud/servers/getting-started/connecting-to-the-server), although I did not get logging in as root to work.
   1. Even tried [resetting the password](https://docs.hetzner.com/cloud/servers/getting-started/rescue-system) a few times. What the what?
   2. Maybe that's because I chose to use an SSH key, so root/pwd logins are turned off?
3. Then you have to set up local SSH stuff
   1. ~/.ssh/config needs an entry like this:

```sh
Host hetzner.com
  HostName 5.78.69.87
  User root
  PreferredAuthentications publickey
  IdentityFile ~/.ssh/hetzner-id_ed25519
```

You probably have at least github.com in there as well, since you are signing your commits, right? Just append to what is there.

Then you can connect with: `ssh hetzner.com`

The first time you connect to a server, you'll want to accept the host fingerprint.

Finally, that worked.

BTW, using the console app from the Hetzner Web console is slow, and I couldn't login anyway, even with my brand new password. So just use a local terminal and ssh. I use [iTerm2](https://iterm2.com/) for MacOS.

---

### Setting up K8s


::: warning
Abandon ship - Do not follow this - keeping for the record; will try to find a better way
:::


I am using the K8s [instructions for production environments](https://kubernetes.io/docs/setup/production-environment/).

### Verify MAC address and product_uuid are unique for every node

Use `ip link` or `ifconfig -a` to see.

For the VM I provisioned, here's teh output of `ip link`

```
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP mode DEFAULT group default qlen 1000
    link/ether 96:00:02:53:8b:96 brd ff:ff:ff:ff:ff:ff
```

And here's the output of ifconfig -a

```
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 5.78.69.87  netmask 255.255.255.255  broadcast 0.0.0.0
        inet6 fe80::9400:2ff:fe53:8b96  prefixlen 64  scopeid 0x20<link>
        inet6 2a01:4ff:1f0:cc55::1  prefixlen 64  scopeid 0x0<global>
        ether 96:00:02:53:8b:96  txqueuelen 1000  (Ethernet)
        RX packets 2587  bytes 311200 (311.2 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2254  bytes 311787 (311.7 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 88  bytes 7154 (7.1 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 88  bytes 7154 (7.1 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

So is this the MAC address? `ether 96:00:02:53:8b:96`

As for product_uuid, run `cat /sys/class/dmi/id/product_uuid` (as root, prepend `sudo ` if you are not)

```
root@ubuntu-4gb-hil-demo-1:~# cat /sys/class/dmi/id/product_uuid
45654ad5-6beb-40f7-b8f5-714ae47e8008
```

I only have one VM so far, so these values are unique.

### Verify ports are open

Apparently, `nc 127.0.0.1 6443` checks that port 6443 is open. I ran it and nothing seemed to happen. Does that mean it's open?

### Install a container runtime

We are going to use CRI-O, so let's do it. 

For reference, I am trying [these steps](https://www.linuxtechi.com/install-crio-container-runtime-on-ubuntu/) that were written on 21 March 2023.

To avoid getting blasted by ads, I will summarize here.

::: warning
1st attempt -- it is not going well...gave up before finishing
:::


[CRI-O installation instructions](https://github.com/cri-o/cri-o/blob/main/install.md#readme)

We are using Kubernetes 1.27, which is the latest at this time. Should work for Ubuntu 22.04, which is also the latest.

Ubuntu uses APT, so we follow those instructions to install CRI-O.

Set some environment variables: 

```
export VERSION=1.27
export OS=xUbuntu_22.04
```

Copying from the instructions...

If installing cri-o-runc (recommended), you'll need to install libseccomp >= 2.4.1. NOTE: This is not available in distros based on Debian 10(buster) or below, so buster backports will need to be enabled:

```
echo 'deb http://deb.debian.org/debian buster-backports main' > /etc/apt/sources.list.d/backports.list
apt update
apt install -y -t buster-backports libseccomp2 || apt update -y -t buster-backports libseccomp2
```

And then run the following as root:

```
echo "deb [signed-by=/usr/share/keyrings/libcontainers-archive-keyring.gpg] https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/ /" > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
echo "deb [signed-by=/usr/share/keyrings/libcontainers-crio-archive-keyring.gpg] https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable:/cri-o:/$VERSION/$OS/ /" > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.list

mkdir -p /usr/share/keyrings
curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/Release.key | gpg --dearmor -o /usr/share/keyrings/libcontainers-archive-keyring.gpg
curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable:/cri-o:/$VERSION/$OS/Release.key | gpg --dearmor -o /usr/share/keyrings/libcontainers-crio-archive-keyring.gpg

apt-get update
apt-get install cri-o cri-o-runc
```

Note: We include cri-o-runc because Ubuntu and Debian include their own packaged version of runc. While this version should work with CRI-O, keeping the packaged versions of CRI-O and runc in sync ensures they work together. If you'd like to use the distribution's runc, you'll have to add the file:

```
[crio.runtime.runtimes.runc]
runtime_path = ""
runtime_type = "oci"
runtime_root = "/run/runc"
```

to `/etc/crio/crio.conf.d/`

Note: as of 1.24.0, the cri-o package no longer depends on `containernetworking-plugins` package. Removing this dependency allows users to install their own CNI plugins without having to remove files first. If users want to use the previously provided CNI plugins, they should also run:

`apt-get install containernetworking-plugins`

Bah!!!

::: warning
2nd attempt -- too much trouble with cni plugin - do they expect people to suffer this much?
:::

---

***Step 1 - Update system***

Update system using: `sudo apt update`

A bunch of systems were restarted (I was prompted and proceeded with what was pre-checked.)

You may be prompted to reboot. Do that with `[ -f /var/run/reboot-required ] && sudo reboot -f`

Of course, that ends the terminal connection, so wait a few seconds and ssh in again.

Install dependencies:

`sudo apt install apt-transport-https ca-certificates curl gnupg2 software-properties-common -y`

That works. Yay!

---

***Step 2 - Add CRI-O repo***

For Ubuntu 22.04 and CRI-O 1.27

```
export OS=xUbuntu_22.04
export CRIO_VERSION=1.24
echo "deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/ /"| sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
echo "deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable:/cri-o:/$CRIO_VERSION/$OS/ /"|sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable:cri-o:$CRIO_VERSION.list
```

Then

```
curl -L https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable:cri-o:$CRIO_VERSION/$OS/Release.key | sudo apt-key add -
curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/Release.key | sudo apt-key add -
```

And one more time: `sudo apt update`

Resulted in some deprecation warnings.

Running `apt list --upgradable` shows 
```
libcap2-bin/unknown 100:2.48-1 amd64 [upgradable from: 1:2.44-1ubuntu0.22.04.1]
libcap2/unknown 100:2.48-1 amd64 [upgradable from: 1:2.44-1ubuntu0.22.04.1]
libpam-cap/unknown 100:2.48-1 amd64 [upgradable from: 1:2.44-1ubuntu0.22.04.1]
```

To upgrade these, run `apt upgrade` and allow the system to restart any impacted services.

---

***Step 3 - Install CRI-O***

`sudo apt install cri-o cri-o-runc -y`

Then start, enable, and verify the daemon

```
sudo systemctl start crio
sudo systemctl enable crio
sudo systemctl status crio
```

When it's working, you will see something like this:

```
crio.service - Container Runtime Interface for OCI (CRI-O)
     Loaded: loaded (/lib/systemd/system/crio.service; enabled; vendor preset: enabled)
     Active: active (running) since Fri 2023-06-30 00:36:18 UTC; 16s ago
       Docs: https://github.com/cri-o/cri-o
   Main PID: 2424 (crio)
      Tasks: 10
     Memory: 11.8M
        CPU: 114ms
     CGroup: /system.slice/crio.service
             └─2424 /usr/bin/crio
```

I also see logging statements. Don't worry about the warnings. I suspect the next steps will take care of those.

```
Jun 30 00:36:18 ubuntu-4gb-hil-demo-1 crio[2424]: time="2023-06-30 00:36:18.946944513Z" level=info msg="Using seccomp default profile when unspecified: true"
Jun 30 00:36:18 ubuntu-4gb-hil-demo-1 crio[2424]: time="2023-06-30 00:36:18.946966274Z" level=info msg="No seccomp profile specified, using the internal default"
Jun 30 00:36:18 ubuntu-4gb-hil-demo-1 crio[2424]: time="2023-06-30 00:36:18.946981212Z" level=info msg="Installing default AppArmor profile: crio-default"
Jun 30 00:36:18 ubuntu-4gb-hil-demo-1 crio[2424]: time="2023-06-30 00:36:18.978039116Z" level=info msg="No blockio config file specified, blockio not configured"
Jun 30 00:36:18 ubuntu-4gb-hil-demo-1 crio[2424]: time="2023-06-30 00:36:18.978074063Z" level=info msg="RDT not available in the host system"
Jun 30 00:36:18 ubuntu-4gb-hil-demo-1 crio[2424]: time="2023-06-30 00:36:18.978502470Z" level=warning msg="Error validating CNI config file /etc/cni/net.d/100-crio-bridge.conf: [failed to find plugin \"bridge\" in path [/opt/cni/bin/]]"
Jun 30 00:36:18 ubuntu-4gb-hil-demo-1 crio[2424]: time="2023-06-30 00:36:18.978592660Z" level=warning msg="Error validating CNI config file /etc/cni/net.d/200-loopback.conf: [failed to find plugin \"loopback\" in path [/opt/cni/bin/]]"
Jun 30 00:36:18 ubuntu-4gb-hil-demo-1 crio[2424]: time="2023-06-30 00:36:18.978607077Z" level=info msg="Updated default CNI network name to "
Jun 30 00:36:18 ubuntu-4gb-hil-demo-1 crio[2424]: time="2023-06-30 00:36:18.997001668Z" level=warning msg="Error encountered when checking whether cri-o should wipe images: version file /var/lib/crio/version not found: open /var/lib/crio/ver>
Jun 30 00:36:18 ubuntu-4gb-hil-demo-1 systemd[1]: Started Container Runtime Interface for OCI (CRI-O).
```

---

***Step 4 - Install CNI Plugins***

```
apt install containernetworking-plugins -y
```

When prompted about restarting services, I checked everything listed. Seemed to go fine.

Edit `/etc/crio/crio.conf` and uncomment the following:

```
network_dir = "/etc/cni/net.d/"

plugin_dirs = [
    "/opt/cni/bin/",
    "/usr/lib/cni/",
]
```

Edit (create) the file `/etc/cni/net.d/11-crio-ipv4-bridge.conflist` with this content:

```
{
  "cniVersion": "1.0.0",
  "name": "crio",
  "plugins": [
    {
      "type": "bridge",
      "bridge": "cni0",
      "isGateway": true,
      "ipMasq": true,
      "hairpinMode": true,
      "ipam": {
        "type": "host-local",
        "routes": [
            { "dst": "0.0.0.0/0" }
        ],
        "ranges": [
            [{ "subnet": "10.85.0.0/16" }]
        ]
      }
    }
  ]
}
```


Then restart CRI-O. `systemctl restart crio`

---

***Step 5 - Install CRI-O tools***

`apt install -y cri-tools`

Confirm the version of crictl and RunTimeVersion.

`crictl --runtime-endpoint unix:///var/run/crio/crio.sock version`

You should see something like this:

```
Version:  0.1.0
RuntimeName:  cri-o
RuntimeVersion:  1.24.6
RuntimeApiVersion:  v1
```

Check if CRI-O is ready to deploy pods using `crictl info` When I did this the first time, I saw:

```
{
  "status": {
    "conditions": [
      {
        "type": "RuntimeReady",
        "status": true,
        "reason": "",
        "message": ""
      },
      {
        "type": "NetworkReady",
        "status": false,
        "reason": "NetworkPluginNotReady",
        "message": "Network plugin returns error: No CNI configuration file in /etc/cni/net.d/. Has your network provider started?"
      }
    ]
  }
}
```

It's supposed to look like below, so I had to troubleshoot. Changed the instructions to match what eventually worked.

```
{
  "status": {
    "conditions": [
      {
        "type": "RuntimeReady",
        "status": true,
        "reason": "",
        "message": ""
      },
      {
        "type": "NetworkReady",
        "status": true,
        "reason": "",
        "message": ""
      }
    ]
  }
}
```

Looking back, after installing cni and showing status, I still had warnings about the network.

```
Jun 30 15:19:46 ubuntu-4gb-hil-demo-1 crio[9524]: time="2023-06-30 15:19:46.368571490Z" level=warning msg="Error validating CNI config file /etc/cni/net.d/100-crio-bridge.conf: [failed to find plugin \"bridge\" in path [/opt/cni/bin/]]"
Jun 30 15:19:46 ubuntu-4gb-hil-demo-1 crio[9524]: time="2023-06-30 15:19:46.368628979Z" level=warning msg="Error validating CNI config file /etc/cni/net.d/200-loopback.conf: [failed to find plugin \"loopback\" in path [/opt/cni/bin/]]"
Jun 30 15:19:46 ubuntu-4gb-hil-demo-1 crio[9524]: time="2023-06-30 15:19:46.368638507Z" level=info msg="Updated default CNI network name to "
```

Had to improve the config setup (above).

---

***Step 6: Create a Pod using crictl utility***

---

***Step 7: Create a container inside a pod***

---



## 30 June 2023

Today, let's try to install containerd. We will keep our ubuntu VM that has all of the changes made when trying to install cri-o. If this doesn't work, it might be worth trying again with a fresh VM.

I am following [these directions](https://www.itzgeek.com/how-tos/linux/ubuntu-how-tos/install-containerd-on-ubuntu-22-04.html) if you want to play along at home.

Rather than copying the steps here, this will be for notes about anything that required a variation to the directions.

Nothing but problems...

### Find better instructions???

Now [these directions](https://www.techrepublic.com/article/install-containerd-ubuntu/)

MAC address of new VM: 96:00:02:54:37:83
Product UUID: 7af17385-3378-4c1a-9604-f340bb0b1151

Nothing I tried works.

* CRI-O was a deadend - cni never started
* containerd never ran - finally found instructions to get the network (cni) started - still had issues running
* KubeOne didn't work - provisioned machines with Terraform - KubeOne couldn't find the sockets to provision control plane daemons
* Rancher community is out of date

What I haven't tried:
* AWS Kubernetes service - way too expensive >$1K per month
* GPC Kubernetes service - should work, since they invented it
* Would another Linux work better?

How is anyone really using this?


### Don't get too excited but...

Just tried on Debian. Maybe it just worked. No massive failures so far.

To be continued...

## 1 July 2023

### Useful for containerd installation

To recap, it looks like containerd is working. 
* [containerd releases](https://github.com/containerd/containerd/releases)
* [runc releases](https://github.com/opencontainers/runc/releases)
* [cni plugin releases](https://github.com/containernetworking/plugins/releases)
* [config example](https://github.com/containerd/containerd/blob/main/docs/man/containerd-config.toml.5.md)
  * although you can also get the default from containerd config and pipe that to the file

So let's keep going.

### installing kubeadm

Next I [installed kubeadm, kubelet, and kubectl](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-kubeadm-kubelet-and-kubectl).

Then the instructions say to configure a cgroup driver. [Doing that](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)

* Prereqs - forwarding IPv4 and letting iptables see bridged traffic
* cgroup drivers

Ran `kubeadm init` and things seemed to work. "Your Kubernetes control-plane has initialized successfully."

This information might come in handy.

```
To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

Alternatively, if you are the root user, you can run:

  export KUBECONFIG=/etc/kubernetes/admin.conf

You should now deploy a pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  https://kubernetes.io/docs/concepts/cluster-administration/addons/

Then you can join any number of worker nodes by running the following on each as root:

kubeadm join 5.78.71.223:6443 --token dnwiob.gxlqqsj8xf1x68ne \
	--discovery-token-ca-cert-hash sha256:bf3ecf6b38976838dc7b0092a2925bf0defa7891815b29a623896c15de2bee38
```


The instructions suggest to run the cluster as a regular user, which makes sense for security reasons. So I created a user, `demo1`, and logged in via another terminal.

### Pod network

Which pod network to install?
* Cilium - looks good: networking, observability, and security solution with an eBPF-based dataplane.
* Calico - container network and security - open source
* Multus - for attaching multiple network interfaces -- don't think we need that

Going with [Cilium](https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/#install-the-cilium-cli) because it looks awesome. Also installation worked.

Cilium 1.13.4 is installed.

Boom!

## What is left to do?

* Set up storage nodes running Rook
* Set up application nodes that use the storage
  * Membership app
* Run things and generate some data
* See all of the things: logging, charts, dashboards
* Switch storage nodes to use KSD

Today, we focus on setting up a minimum set of storage nodes. For stability, the minimum seems to be 4 nodes with each node having 2 ODS, paired with 1 HDD each.

According to Ceph docs, 2 OSDs is the minimum for replication to happen. However, that configuration would not survive a drive failure.

Let's see if 3 nodes with 1 OSD each will work.

Steps to expand the K8s cluster:

* Provision 3 VMs, one at a time.
  * Attach 1 10GB unformatted HHD
  * On each
    * Set up containerd, kubeadm (and friends), and networking.

Once the nodes are set up, use Rook to include in cluster.

## Debian installation steps

::: warning
Did not work on the second server. Must have missed something.
:::

Today, set up 3 storage nodes and 1 worker. Put a few pods on the worker that access storage.

Here's what I am doing...

### Provision VM

* lowest spec from Hetzner: 2 VCPU, 2 GB RAM, 40 GB local drive
* attached volume: 20 GB (formatted - no option not to format)
* using SSH key for host access


### Install containerd

* Looks like there's a long way if you want the latest. Follow these steps.
  * The short way is to use `apt install containerd` If you do this, you may still need to set up containerd.service.
* `apt update`
  * `apt list --upgradable`
  * `apt upgrade`
* find the latest version that matches OS, architecture
  * in this case: [containerd-1.7.2-linux-amd64](https://github.com/containerd/containerd/releases/download/v1.7.2/containerd-1.7.2-linux-amd64.tar.gz)
* use the following commands to:
  * download the zip and checksum files
  * verify the checksum
  * install and extract containerd files

```
mkdir download
cd download
wget https://github.com/containerd/containerd/releases/download/v1.7.2/containerd-1.7.2-linux-amd64.tar.gz
wget https://github.com/containerd/containerd/releases/download/v1.7.2/containerd-1.7.2-linux-amd64.tar.gz.sha256sum
cat containerd-1.7.2-linux-amd64.tar.gz.sha256sum
sha256sum ./containerd-1.7.2-linux-amd64.tar.gz
tar Cxzvf /usr/local containerd-1.7.2-linux-amd64.tar.gz
```

### Set up containerd.service

* Since we are running Debian, which uses systemd, do the following:

```
wget https://raw.githubusercontent.com/containerd/containerd/main/containerd.service
mkdir -p /usr/local/lib/systemd/system
cp containerd.service /usr/local/lib/systemd/system/
systemctl daemon-reload
systemctl enable --now containerd
```

### Set up container runtimes

* Create config file, and turn on SystemdCgroup.

```
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml
vi /etc/containerd/config.toml
```

* Change `SystemdCgroup` from `false` to `true`

`systemctl restart containerd`


### Install runc: `apt install runc`

* [runc releases are available](https://github.com/opencontainers/runc/releases) and may be more up to date
* runc that is built for the specific OS may be more secure (although slightly behind)


## Manual installation on Ubuntu

### Set up containerd

* provisioned 4 VMs: 1 control plane and 3 data nodes
* setting up all at the same time
* Ubuntu 22.04

Setting up each machine with:

* `apt update`
* `apt upgrade`
* reboot: `shutdown -r now`
* `apt install containerd`
* `curl -L https://raw.githubusercontent.com/containerd/containerd/main/containerd.service -o /usr/local/lib/systemd/system/containerd.service`
  * edit and change 
    * `ExecStartPre=-/usr/sbin/modprobe overlay`
    * `ExecStart=/usr/bin/containerd`
* `systemctl daemon-reload`
* `systemctl enable --now containerd`
* `mkdir -p /etc/containerd`
* `containerd config default > /etc/containerd/config.toml`
* `vi /etc/containerd/config.toml`
  * change `SystemdCgroup = true`
* restart: `systemctl restart containerd`

Regarding cgroup drivers, Ubuntu uses systemd. Looks like we don't need to worry about them since k8s v1.22 if using kubeadm, which we are. 

### Install CNI plugins

```
wget https://github.com/containernetworking/plugins/releases/download/v1.3.0/cni-plugins-linux-amd64-v1.3.0.tgz
wget https://github.com/containernetworking/plugins/releases/download/v1.3.0/cni-plugins-linux-amd64-v1.3.0.tgz.sha256
cat cni-plugins-linux-amd64-v1.3.0.tgz.sha256
sha256sum cni-plugins-linux-amd64-v1.3.0.tgz
mkdir -p /opt/cni/bin
tar Cxzvf /opt/cni/bin cni-plugins-linux-amd64-v1.3.0.tgz
```

### How to use containerd

* containerd: [basic usage](https://github.com/containerd/nerdctl#readme)

### Install kubeadm, kubectl, kubelet

Use the following commands to:
* Make sure dependencies are in place.
* Get Google Cloud signing key. 
* Add K8s apt repo. 
* Update apt package index, install kubelet, kubeadm and kubectl, and pin their versions.

```
apt-get update
apt-get install -y apt-transport-https ca-certificates curl gpg
curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-archive-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```

### Install Cilium (or whichever Pod network works for you)

::: warning
This didn't work because the cluster is not named yet.
TODO - troubleshoot, might need to initialize the cluster first
:::

* Install Cilium CLI

```
CILIUM_CLI_VERSION=$(curl -s https://raw.githubusercontent.com/cilium/cilium-cli/master/stable.txt)
CLI_ARCH=amd64
if [ "$(uname -m)" = "aarch64" ]; then CLI_ARCH=arm64; fi
curl -L --fail --remote-name-all https://github.com/cilium/cilium-cli/releases/download/${CILIUM_CLI_VERSION}/cilium-linux-${CLI_ARCH}.tar.gz{,.sha256sum}
sha256sum --check cilium-linux-${CLI_ARCH}.tar.gz.sha256sum
sudo tar xzvfC cilium-linux-${CLI_ARCH}.tar.gz /usr/local/bin
rm cilium-linux-${CLI_ARCH}.tar.gz{,.sha256sum}apt 
```


* Now install Cilium with `cilium install`

### Forwarding IPv4 and letting iptables see bridged traffic

```
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```

Verify br_netfilter and overlay are loaded:

```
lsmod | grep br_netfilter
lsmod | grep overlay
```

output looks like:

```
br_netfilter           32768  0
bridge                307200  1 br_netfilter
overlay               151552  0
```

Verify that the net.bridge.bridge-nf-call-iptables, net.bridge.bridge-nf-call-ip6tables, and net.ipv4.ip_forward system variables are set to 1 in your sysctl config by running the following command:

```
sysctl net.bridge.bridge-nf-call-iptables net.bridge.bridge-nf-call-ip6tables net.ipv4.ip_forward
```

output looks like:

```
tables net.ipv4.ip_forward
net.bridge.bridge-nf-call-iptables = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward = 1
```

