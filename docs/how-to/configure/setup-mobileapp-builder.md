---
sidebar_label: Setup Mobile App Builder
title: Setup Mobile App Build Machine
---

hamlet supports building iOS and Android based mobile apps through [mobileapp](https://docs.hamlet.io/reference?type=Component&instance=mobileapp) components defined in your solution along with a publish command which looks after building, signing and distributing your app through various hosting services.

This guide takes you through the process of setting up a build machine which has everything we need to run the publish command. The Android and iOS build processes are a bit complicated and have some pre-requisites that we will cover off here.

:::info

Our recommended approach here is to use homebrew along with installation managers for the different languages used. You don't have to use this approach but it does make life easy

:::

:::warning

For iOS based mobile apps you must use a macOS based machine to perform the builds. Our process only outlines the setup required for an existing macOS machine. While Android builds don't require this its generally easiest to run both on macOS machine.

:::

## Process

Perform the following tasks to setup your build machine

1. Install [Xcode](https://apps.apple.com/au/app/xcode/id497799835?mt=12) and [Transporter](https://apps.apple.com/au/app/transporter/id1450874784?mt=12) from the Mac App Store. These are published by Apple and install the required SDKs and tools needed to work with iOS apps from a Mac
1. Pick a user on your mac that will be used to run builds of your apps. Some of the installs as part of the next part of this process are specific to users so this should be run for each user that might run a mobile build
1. Copy the contents of the script block below into a .sh script on your mac ( it does require sudo access as part of the script)

    :::tip

    we are installing quite a few dependencies as part of this script so the overview of the install process

    1. Install the xcode command line tools these are used by other tools in the process to run scripted tasks
    1. Install json and xml tools to manipulate the configuration files for expo based apps and android xml configuration files
    1. Install the *env tools for python, node, and ruby. Each of these languages are used at some point in the process. Using version management tools like this allow us to run builds of apps that are using different versions of these languages ( especially node) and lets us control which version is in use
    1. Install image manipulation tools required for adding environment badges to the app icons during the build
    1. Install the android command line tools and java which is used by the Android tools
    1. Configure the *env tools so they can modify the path for the appropriate versions of the languages and make sure the package management for node is good to go
    1. Install stable versions of each of the languages that we know work with the build process
    1. Install the aws cli v2 which is now provided as a mac installer instead of a python package
    1. Configure the android command line tools, accept the licences for the tools and install the extra dependencies required to build apps

    If you aren't comfortable with any of these processes feel free to update them to work in your own way
    :::

    ```bash
    #! /bin/bash
    set -euo pipefail

    # Install command line extras
    sudo xcode-select --install

    # Homebrew installs
    brew upgrade
    brew install \
        jq \
        python-yq \
        pyenv \
        rbenv \
        nodenv \
        nodenv/nodenv/nodenv-default-packages \
        jenv \
        librsvg \
        imagemagick

    # Homebrew cask installs
    brew tap homebrew/cask-versions
    brew install --cask android-commandlinetools temurin temurin11

    # Ensure that npm and yarn are always installed and up to date
    cat << EOF >> "$(nodenv root)/default-packages"
    npm
    yarn
    EOF

    # Activate pyenv
    if ! grep -qF "pyenv init" ~/.bash_profile; then
    cat << 'EOF' >> ~/.bash_profile
    export PYENV_ROOT="$HOME/.pyenv"
    export PATH="$PYENV_ROOT/bin:$PATH"
    eval "$(pyenv init --path)"
    EOF
    fi

    # Activate nodenv
    if ! grep -qF "nodenv init" ~/.bash_profile; then
    cat << 'EOF' >> ~/.bash_profile
    #nodenv install
    eval "$(nodenv init -)"
    EOF
    fi

    # Activate rbenv
    if ! grep -qF "rbenv init" ~/.bash_profile; then
    cat << 'EOF' >> ~/.bash_profile
    #rbenv install
    eval "$(rbenv init -)"
    EOF
    fi

    # Activate jenv
    if ! grep -qF "jenv init" ~/.bash_profile; then
    cat << 'EOF' >> ~/.bash_profile
    # jenv setup"
    export PATH="$HOME/.jenv/bin:$PATH"
    eval "$(jenv init -)"
    EOF
    fi

    # Update our PATH from the activation of the different *env tools
    source ~/.bash_profile

    # Set a default global package for python, node, ruby
    node_version="$(nodenv install --list | grep '^16.' | tail -1 | xargs)"
    nodenv install -s "${node_version}" && nodenv global "${node_version}"

    python_version="$(pyenv install --list | grep -F '3.9.' | grep -v '[a-zA-Z]' | tail -1 | xargs)"
    pyenv install -s "${python_version}" && pyenv global "${python_version}"

    ruby_version="$(rbenv install --list | grep '^2.7.' | tail -1 | xargs)"
    rbenv install -s "${ruby_version}" && rbenv global "${ruby_version}"

    # Set the latest Java11 as the version to use
    installed_java_11="$(brew info temurin11 --json=v2 --cask | jq -r '.casks[0].installed')"
    installed_java_11="${installed_java_11%,*}"
    jenv add "$(/usr/libexec/java_home -v "${installed_java_11}")"
    jenv global "${installed_java_11}"

    # Install AWS CLI v2
    curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "/tmp/AWSCLIV2.pkg"
    sudo installer -pkg "/tmp/AWSCLIV2.pkg" -target /

    # Setup android SDK
    # - Accept Licenses
    yes | sdkmanager --licenses
    sdkmanager 'platforms;android-30' 'platforms;android-10' 'build-tools;30.0.2' 'ndk;21.0.6113669'

    # Set the Android env vas for the SDK
    if ! grep -qF "ANDROID_HOME" ~/.bash_profile; then
    cat << 'EOF' >> ~/.bash_profile
    # Android SDK setup
    export ANDROID_HOME=/usr/local/share/android-commandlinetools/
    export ANDROID_SDK_ROOT=/usr/local/share/android-commandlinetools/
    export ANDROID_AVD_HOME=~/.android/avd
    EOF
    fi

    # Disable the osxkeychain credential helper for git
    # If this isn't disabled Jenkins jobs can fail as keychain will ask you for the password for a credential
    sudo git config --global --add credential.helper ""

    # Update our PATH from the activation of the different *env tools
    source ~/.bash_profile
    ```

1. Run the script and enter your sudo credentials when prompted
1. Once you script has complete you should now be ready to run the publish command `hamlet run expo-app-publish`
