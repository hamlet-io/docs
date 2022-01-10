---
sidebar_label: Introduction
title: Docs Site
---

The docs site is the site that you are reading this page from and is used to document the features and architecture of hamlet

## Docusaurus

Using OpenSource documentation framework [docusaurus](https://docusaurus.io/docs)

## What is Docusaurus?

* A React documentation framework useful for displaying application documentation
* It’s pluggable
* Deployable with static-site hosting services like Netlify and Vercel

## Hosting

We host the site through [Vercel](https://vercel.com/hamlet/hamlet-docs) using their free services for open source projects

## Current Configuration

* Using the default layout plugin for Docusaurus
* Customised the colours through the “infima” CSS styling framework that comes bundled with Docusaurus
* Search indexing is performed by [Agolia Search](https://www.algolia.com/) which is free for open source projects

## Customisations

* Custom React Components that read in the published hamlet JSONSchema & render them
