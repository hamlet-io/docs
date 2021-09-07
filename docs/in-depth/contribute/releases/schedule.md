---
sidebar_label: Release Schedule
title: Release Schedule
---

hamlet releases follow the release train model ([Spotify Example](https://labs.spotify.com/2014/03/27/spotify-engineering-culture-part-1/), [Agile Description](https://www.scaledagileframework.com/agile-release-train/)) where releases are made at scheduled intervals. With this model, all commits to the master branch should be considered release candidates.

## Releases

Our release cycle is structured into three stages. The releases are structured this way to ensure that there is a stable deployment model in place for infrastructure deployments.

### Train

The train release is the stable product release which is the recommended release of hamlet. The train is scheduled quarterly on the first of February, May, August, November.

### Tram

The tram release is a rollup of the work completed between train releases. The tram release is intended for the testing of new features for the next train but with less risk of running into issues with actively developed work. Trams are scheduled to run every two weeks and will be treated as release candidates for the next train release.

### Unicycle

The unicycle release is our latest development code and is generally the master branch of code in the hamlet code repositories. Builds of the unicycle release are triggered on each commit to the code repositories.

### Patch Releases

Patch releases releases are bugfix releases for a train release. They are not scheduled and will be released as required.

By their nature, trams and unicycle releases do not have patch releases assoicated with them. Bug fixes are simply included in the next release.

## Feature Tags

Since releases are schedule based, a feature or change to hamlet might not always be ready to go. To work within this process, changes should be submitted with the ability to toggle the new change on or off, off by default. This toggle is called a Feature Tag. Feature tags are named based on the feature that is being added and feature tags are enabled in hamlet via an environment variable `FEATURE_TAG` for bash scripts and `featureTag` in freemarker templates.

When a change is ready to go, the feature tag logic and the legacy code are removed as part of the next scheduled train release. Until the change is ready, the change can only be enabled with the use of feature tags.

## Version Tags

hamlet follows [semver 2.0.0](https://semver.org/spec/v2.0.0.html) with alignment to our release schedules.

- **Major - v1.x.x** When the release includes a `BREAKING CHANGE` per [our commit convention](https://www.conventionalcommits.org/), or (more rarely) when the hamlet team deem the release significant enough to warrant a major release increment.
- **Minor - vx.1.x** Each train release increments the minor version number
- **Patch - vx.x.1** Urgent fixes for the most recent train release
- **Release Candidate - vx.2.x-rc1** Each tram release is treated as a release candidate for the next train release

With this format the release candidate and minor versions will increment on a regular basis, the major release when a breaking change is included and patch releases as determined by the hamlet team.
