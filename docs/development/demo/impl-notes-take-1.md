---
title: Demo system - Dave's manual implementation notes
---

# Demo system - Dave's manual implementation notes

These notes capture Dave's attempt to set up a demo system for shoring Koor Rook Ceph in Kubernetes. The [overview](index) defines the target system. As with all plans, they go bad at the first sign of trouble. The discovery of what worked is documented here.

A word of caution, the fact that something "worked" in that I was able to continue with the next step does not mean that I made the best decisions. A big part of the this exercise is to learn how all of this works, and there are a lot of moving parts.

Basically, apply your own judgement and critical thinking, and experiment with alternate approaches to everything.


## Target requirements

For this exercise, I am attempting to set up a minimum environment that would be suitable for production. That means I will not use minikube, favoring kubeadm and other production-grade tooling. The system will use multiple hosts. However, on Hetzner where this is being provisioned, there are limits of 10 vCPU and 8 hosts. The minimum number of CPUs per K8s node is 2, so we are limited to 5 hosts. Given that constraint we will start by setting up:

* 1 control plane node
* 1 worker node
* 3 storage nodes

This system would not be suitable for mission-critical use. For example, we recommend 4 storage nodes as a minimum to allow for recovery from a single node failure. However, this will be a good starting point to expand on by by adding more nodes and capacity: CPUs, memory, drives, etc.


## General approach

After 3 or 4 attempts, a basic pattern for setting things up by hand is emerging.

1. Provision machines, or define what to provision
   1. We are using Hetzner for VM hosting by the minute. That's a good approach for temporary environments. The smallest host with 2 CPU is about 3.5 Euro per month. I don't think it gets much cheaper.
   2. We should use a provisioning tool, like [Terraform](https://www.terraform.io/). In fact, if we use KubeOne to set up the Kubernetes cluster, it uses Terraform under the hood for host provisioning. KubeOne integrates with AWS, CGP, Hetzner and others.
   3. Provisioning by hand works, too.
2. Set up pre-requisites for K8s
   1. Each host needs a container runtime: containerd or CRI-O
      1. Ubuntu and Debian have packages for containrd. Install that and configure according to instructions.
   2. Set up networking, CNI, plugins, etc.
3. Install K8s and set up a cluster
   1. TBD
4. Use Koor Operator to set up data storage -- it should be that easy if the rest was done right
   1. TBD


## Manual installation on Ubuntu

### Provisioning servers (VMs) on Hetzner

Hardware and network

* The minimum spec is CPX11: 2 vCPU, 2GB RAM, 40GB local SSD, 3.85 Euro / mo
  * Select Ubuntu 22.04 (or choose a different OS, but you will need to make adjustments as you go through these instructions)
  * Small additional charge for public IPv4
  * Worth thinking about what needs access from outside, limitation on number of public IPs
* Drives are provisioned separately and attached to a host
  * Available in 10 GB increments up to 10 TB
  * Need 1 per storage node to start. Expand to 2 per node once things are running.
  * They come with a file system: XDF or EXT4 -- will need to remove that before setting up Ceph
* Also available: load balancers, floating IPs, networks (e.g., private between nodes might be handy), firewalls and security keys.


### Logging in

These tips might save you some time and frustration when logging in to your hosts.

1. As you are provision a server, you can created an SSH key or use an existing key. Do this: create one, then use the same one for all hosts. The private side of that key goes on your local machine.
2. You can log in as root over SSH. By default, root does not allow login/password over SSH. [Directions are here](https://docs.hetzner.com/cloud/servers/getting-started/connecting-to-the-server).
   1. If you ever need to reset a password, do it from the Cloud Console. [Resetting the password](https://docs.hetzner.com/cloud/servers/getting-started/rescue-system)
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

```sh
wget https://github.com/containernetworking/plugins/releases/download/v1.3.0/cni-plugins-linux-amd64-v1.3.0.tgz
wget https://github.com/containernetworking/plugins/releases/download/v1.3.0/cni-plugins-linux-amd64-v1.3.0.tgz.sha256
cat cni-plugins-linux-amd64-v1.3.0.tgz.sha256
sha256sum cni-plugins-linux-amd64-v1.3.0.tgz
mkdir -p /opt/cni/bin
tar Cxzvf /opt/cni/bin cni-plugins-linux-amd64-v1.3.0.tgz
```

### How to use containerd

For reference: [containerd basic usage](https://github.com/containerd/nerdctl#readme)


### Install kubeadm, kubectl, kubelet

Use the following commands to:
* Make sure dependencies are in place.
* Get Google Cloud signing key. 
* Add K8s apt repo. 
* Update apt package index, install kubelet, kubeadm and kubectl, and pin their versions.

```sh
apt-get update
apt-get install -y apt-transport-https ca-certificates curl gpg
curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-archive-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-archive-keyring.gpg] https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```

### Forwarding IPv4 and letting iptables see bridged traffic

```sh
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF

modprobe overlay
modprobe br_netfilter

# sysctl params required by setup, params persist across reboots
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF

# Apply sysctl params without reboot
sysctl --system
```

Verify br_netfilter and overlay are loaded:

```sh
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

```sh
sysctl net.bridge.bridge-nf-call-iptables net.bridge.bridge-nf-call-ip6tables net.ipv4.ip_forward
```

output looks like:

```
tables net.ipv4.ip_forward
net.bridge.bridge-nf-call-iptables = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward = 1
```

### Initialize cluster - starting with the control plane node

On the control plane node, initialize a cluster with: `kubeadm init`

**Important: Worker nodes will need to join this cluster, so the initialization command and procedure is different.**

When it's done, you should see instructions like the following:

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

The instructions suggest to run the cluster as a regular user, which makes sense for security reasons. You can also run as root, since it's easier to get things to work that way. In the long run, better to run as a user with limited permissions.


### Install Cilium (or whichever Pod network works for you)

You need to add a pod network for your cluster. [Read about it here](https://kubernetes.io/docs/concepts/cluster-administration/addons/) I liked Cilium the best based on the brief descriptions of what is available.

Options I considered:

* Cilium - looks good: networking, observability, and security solution with an eBPF-based dataplane.
* Calico - container network and security - open source
* Multus - for attaching multiple network interfaces -- don't think we need that

* Install Cilium CLI

```sh
CILIUM_CLI_VERSION=$(curl -s https://raw.githubusercontent.com/cilium/cilium-cli/master/stable.txt)
CLI_ARCH=amd64
if [ "$(uname -m)" = "aarch64" ]; then CLI_ARCH=arm64; fi
curl -L --fail --remote-name-all https://github.com/cilium/cilium-cli/releases/download/${CILIUM_CLI_VERSION}/cilium-linux-${CLI_ARCH}.tar.gz{,.sha256sum}
sha256sum --check cilium-linux-${CLI_ARCH}.tar.gz.sha256sum
sudo tar xzvfC cilium-linux-${CLI_ARCH}.tar.gz /usr/local/bin
rm cilium-linux-${CLI_ARCH}.tar.gz{,.sha256sum}apt 
```

* Now install Cilium with `cilium install`
* Verify cilium install using `cilium status --wait`
  * You should see something like this:

```
    /¯¯\
 /¯¯\__/¯¯\    Cilium:             OK
 \__/¯¯\__/    Operator:           OK
 /¯¯\__/¯¯\    Envoy DaemonSet:    disabled (using embedded mode)
 \__/¯¯\__/    Hubble Relay:       disabled
    \__/       ClusterMesh:        disabled

DaemonSet              cilium             Desired: 1, Ready: 1/1, Available: 1/1
Deployment             cilium-operator    Desired: 1, Ready: 1/1, Available: 1/1
Containers:            cilium             Running: 1
                       cilium-operator    Running: 1
Cluster Pods:          2/2 managed by Cilium
Helm chart version:    1.13.4
Image versions         cilium             quay.io/cilium/cilium:v1.13.4@sha256:bde8800d61aaad8b8451b10e247ac7bdeb7af187bb698f83d40ad75a38c1ee6b: 1
                       cilium-operator    quay.io/cilium/operator-generic:v1.13.4@sha256:09ab77d324ef4d31f7d341f97ec5a2a4860910076046d57a2d61494d426c6301: 1
```

### Missing last step

The next thing is to start the cluster and apply the config for Cilium. Wasn't able to find an example config file, which blocked me. Basically, I ran out of clues.

So I ordered the course, [Kubernetes Fundamentals (LFS258) - Basics of Kubernetes | The Linux Foundation](https://training.linuxfoundation.org/training/kubernetes-fundamentals/). After setting up my AWS account, the first action in the course is to prep a couple of nodes for K8s. Basically, it went through the same steps I have already learned, but also makes a few of the choices less ambiguous. Instead of Cilium, it uses Calico, but also says Cilium is a great up-and-coming option.

What I learned so far from the course is that everything here is essentially correct and useful as a way to set things up. The course is useful because set-up is just the beginning. There's a lot more to get through, and no point in struggling without guidance.

Also, I will not face the same resouce constraints on AWS. I have already set up a control plane node and one worker node. Now I can repeat the worker node set up to get some data nodes going.

This is the end of the journal for now.


## Misc resources

Recent releases of pre-reqs:

* [containerd releases](https://github.com/containerd/containerd/releases)
* [runc releases](https://github.com/opencontainers/runc/releases)
* [cni plugin releases](https://github.com/containernetworking/plugins/releases)
* [config example](https://github.com/containerd/containerd/blob/main/docs/man/containerd-config.toml.5.md)
  * although you can also get the default from containerd config and pipe that to the file

I thought these generic releases were important before learning that packages are available for containerd. Presumably the packages are tuned for the flavor of Linux. (Perhaps, or maybe they adopt the common version without changing much. I suppose we don't need to worry about that for our demo system.)

