---
title: Release Management
---

# KSD Release Management

This is the process we follow to publish a new release of KSD.

There are two parts to the process

1. Cut and Release from the koor-tech/koor master when Rook does a major release,
   eg. When Rook 1.12 is release, we mark our major release at the same time Koor 1.12

2. Our release candidate for any other release, can be a minor version diverging from Rook
   eg: Our regular monthly/weekly release can be v1.12.1

## Merge in changes

### Release for Major Rook/Koor Version

* Pull Changes latest changes of Rook upstream to koor-tech/koor by running `Backport upstream changes (Cronjob)` github action from Koor repository.
* A PR with Rook upstream latest changes will be opened against master, please verify their are no merge conflicts, otherwise resolve them locally and repush.
* Include new Koor improvements PRs that are ready to publish.
* Make sure dependencies are up to date.
* After review and merge of this PR, along with others, we follow the Rook release guide, to make a major release.
* After this Create a new release branch from koor-tech/koor master, the branch should be named as `release-x.xx`, eg,

```console
$ git checkout -b release-1.12
```
* Follow the steps for triggering release builds after the above steps.

### Release for Minor Rook/Koor Version

* To the existing release branch(created at time of major release), merge Rook upstream release branch commits.
* Merge our backport commits if any to the koor/release-${version} branch
* Follow the steps for triggering release builds after the above steps.

### Steps for triggering release builds

* After we have a updated release branch available based on version for release,
  follow the following to trigger `Push Build Release` github action.

```console
  git checkout <branch> # e.g. release-1.10
  # set to the new release
  tag_name=<release version> # e.g., v1.10.9
  git tag -a "$tag_name" -m "$tag_name release tag"
  git push upstream "$tag_name"
  git push upstream <branch> #e.g. release-1.10
```
* After the successful run of github action, you should be able see the builds
  published at [Koor Dockerhub](https://hub.docker.com/repository/docker/koorinc/)

## Build and test

* Verify all tests from github actions are successful and builds are tested.
* #TODO: Builds simple testing
* #TODO: Add some Quality Assurance/Integration Tests of Koor features

## Update documentation

1. Add What's New in KSD x.y.z" to Release-Notes markdown.
2. Update Koor Operator and other tools the use KSD to use the latest release.

## Post the announcement

1. Create a blog post. Cut and paste the contents of What's New.
2. Publish the post.
3. Post to social media, including a link to the blog.
   1. LinkedIn
   2. Twitter
   3. Medium

## Update Koor Tools to use latest KSD version

* Make sure we always point to the latest build.
