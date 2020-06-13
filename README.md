# Website

This website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.

### Installation

```
$ npm install
```

### Local Development

```
$ npm start
```

This command starts a local development server and open up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ npm run build
```

### Update Docusaurus Version

Update package.json to the latest version numbers for both `@docusaurus/core` and `@docusaurus/preset-classic`; then:

```
npm install
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Test

```
npm start

# seperately, whilst site running
npm test
```

### Contribute

1. fork the repository
2. update your changes in a feature branch
3. Push to your fork's origin
4. Create a Pull Request from your Fork to the Upstream master.

```bash
# fork the repository on Github.
# https://github.com/codeontap/hamlet-docs.git

# add your upstream repo
git remote add upstream https://github.com/codeontap/hamlet-docs.git

# create your working branch
git checkout -b feature-my-feature-branch

# make your changes / updates / fixes in as many commits as necessary.

# rebase your work into only relevant commit messages
# example: I've made 3 commits, but two of them are fixups.
# git rebase -i HEAD~3
# mark the fixups and save the commits
git rebase -i HEAD~<number of commits since HEAD>

# push your feature branch to your origin (the fork)
git push --set-upstream origin feature-my-feature-branch

# on Github, create a PR from your fork/feature-branch to upstream/master.
# make sure you complete any Issue/PR templates provided.
```
