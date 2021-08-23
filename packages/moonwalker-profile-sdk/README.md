# 🌙 MoonwalkerSwap Profiles SDK

This package provides some handy functions to retrieve data for MoonwalkerSwap Profile system.

##### Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Initialization](#initialization)
  - [getUsername](#getUsername)
  - [getTeam](#getTeam)
  - [getProfile](#getProfile)
  - [getAchievements](#getAchievements)
- [Roadmap](#roadmap)

## Installation

Install `moonwalkerswap-profile-sdk` into your project with npm:

```bash
npm install moonwalkerswap-profile-sdk --save
```

or yarn:

```bash
yarn add moonwalkerswap-profile-sdk
```

This package requires `ethers`, `graphql` and `graphql-request` to be installed in your project.

```bash
# npm
npm install ethers graphql graphql-request --save
# yarn
yarn add ethers graphql graphql-request
```

## Usage

### Initialization

First set is to initialize the SDK with the following:

```js
import MoonwalkerProfileSdk from "moonwalkerswap-profile-sdk";

const moonwalkerSdk = new MoonwalkerProfileSdk();
```

You can pass optional arguments to the constructor:

- `provider` - custom RPC Provider instance if you want to use custom configuration, if not provided defaults to provider with random node from the [list of RPC nodes](src/utils/getRpcUrl.ts)
- `chainId` - what chain ID to use, if not provided defaults to `56`

```js
import MoonwalkerProfileSdk from "moonwalkerswap-profile-sdk";
import { ethers } from "ethers";

const customProvider = new ethers.providers.JsonRpcProvider("https://example.com");

const moonwalkerSdk = new MoonwalkerProfileSdk(customProvider, 97);
```

### getUsername

Returns username for a given address. If the address does not have a profile or there is an error - returns empty string `""`.

```js
import MoonwalkerProfileSdk from "moonwalkerswap-profile-sdk";

const moonwalkerSdk = new MoonwalkerProfileSdk();
const username = moonwalkerSdk.getUsername("0x123456789");
console.log(username); // "Johnathan"
```

### getTeam

Returns team information for the team ID. In case of network error returns null. Note that at the moment `points` will return `0` for all teams (total team points will be calculated soon).

```js
import MoonwalkerProfileSdk from "moonwalkerswap-profile-sdk";

const moonwalkerSdk = new MoonwalkerProfileSdk();
const team = moonwalkerSdk.getTeam(1);
console.log(team);

```

### getProfile

Returns full profile data for a given address. Under the hood retrieves username and team data using `getUsername` and `getTeam` and combines it with data from the profile contract. If address does not have a profile - returns `{ hasRegistered: false, profile: null }`. At the moment does not retrieve achievements (see [getAchievements](#getAchievements)).

It also sets `profile_${address}` cookie containing username and avatar (only for swap.moonwalker.network domain)

```js
import MoonwalkerProfileSdk from "moonwalkerswap-profile-sdk";

const moonwalkerSdk = new MoonwalkerProfileSdk();
const profile = moonwalkerSdk.getProfile("0x123456789");
console.log(profile);
```

### getAchievements

Returns array of achievements for a given address. If address has no achievements or no profile at all - returns empty array `[]`.

```js
import MoonwalkerProfileSdk from "moonwalkerswap-profile-sdk";

const moonwalkerSdk = new MoonwalkerProfileSdk();

const achievements = moonwalkerSdk.getAchievements("0x123456789");
console.log(achievements);

```

## Roadmap

Current version of this SDK is 90% copy of existing from [moonwalkerswap-frontend](https://github.com/MoonWalkerJim/MoonWalker-Frontend) repo. There are several improvements to be made in the future versions of this SDK:

- [ ] Better error handling (common bad status codes or broken internet connection)
- [ ] Allow username & avatar cookie to be configurable or optional
- [ ] Validate addresses and don't attempt to fetch data if address is not valid
- [ ] NodeJS support. Currently it works out of the box only in browser. Need to research different options for cross-fetch and choose the one that provides less friction and increases bundle size the least.
