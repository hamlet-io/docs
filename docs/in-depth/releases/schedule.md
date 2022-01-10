---
sidebar_label: Release Schedule
title: Release Schedule
---

hamlet releases follow the release train model ([Spotify Example](https://labs.spotify.com/2014/03/27/spotify-engineering-culture-part-1/), [Agile Description](https://www.scaledagileframework.com/agile-release-train/)) where releases are made at scheduled intervals. With this model, all commits to the master branch should be considered release candidates.

## Official Candidates

hamlet provides a range of repos and tools that work with or extend hamlet for different purposes. Out of these we only offer official releases for the following repositories

| Name        | Release Artefact                 | Repository                                     |
|-------------|----------------------------------|------------------------------------------------|
| cli         | https://pypi.org/project/hamlet/ | https://github.com/hamlet-io/executor-python   |
| engine-base | https://github.com/hamlet-io/hamlet-engine-base/pkgs/container/hamlet-engine-base | https://github.com/hamlet-io/hamlet-engine-base |

The engine release is built from a number of other sources which are listed as part of the engine repository

## Engine Release Cycle

The engine release cycle is structured into three stages. The releases are structured this way to ensure that there is a balance of latest features with stability for production application deployments.

### Unicycle

The unicycle release is our latest development code and is generally based on the default branch of code in the hamlet repositories. Builds of the unicycle release are created on each commit to the hamlet repositories.

### Tram

The tram release is a rollup of the work completed between train releases. The tram release is intended for the testing of new features for the next train but with less risk of running into issues with actively developed work. The tram release process runs from the hamlet-engine-base repo each night and performs an in depth testing cycle across different aspects of hamlet.

### Train

The train release is the stable product release which is the recommended release of hamlet. The train is scheduled quarterly on the first of February, May, August, November.

### Patch Releases

Patch releases releases are bugfix releases for a train release. They are not scheduled and will be released as required. By their nature, trams and unicycle releases do not have patch releases associated with them. Bug fixes are simply included in the next release.

## Feature Tags

Since releases are schedule based, a feature or change to hamlet might not always be ready to go. To work within this process, changes which will impact existing deployments should be disabled by default or have a configuration option to control their behaviour.

## Version Tags

hamlet follows [semver 2.0.0](https://semver.org/spec/v2.0.0.html) with alignment to our release schedules.

- **Major - v1.x.x** When the release includes a `BREAKING CHANGE` per [our commit convention](https://www.conventionalcommits.org/), or (more rarely) when the hamlet team deem the release significant enough to warrant a major release increment.
- **Minor - vx.1.x** Each train release increments the minor version number
- **Patch - vx.x.1** Urgent fixes for the most recent train release
- **Release Candidate - vx.2.x-rc1** Each tram release is treated as a release candidate for the next train release

With this format the release candidate and minor versions will increment on a regular basis, the major release when a breaking change is included and patch releases as determined by the hamlet team.
