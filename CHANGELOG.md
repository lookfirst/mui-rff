# Changelog

## [8.1.0](https://github.com/lookfirst/mui-rff/compare/v8.0.4...v8.1.0) (2025-07-06)


### Features

* add build-example script ([b928ee9](https://github.com/lookfirst/mui-rff/commit/b928ee98d66fa61e01ccd219655a782a1e9a8dcb))
* add release-please integration ([520eb74](https://github.com/lookfirst/mui-rff/commit/520eb74ee5c4789abded223f0c6a24223a2d3f67))
* add release-please npm package ([e9b0881](https://github.com/lookfirst/mui-rff/commit/e9b08817b6e8b47d0c7512cb2937fc9a53ba9c20))
* update lockfile ([e01525a](https://github.com/lookfirst/mui-rff/commit/e01525a6d5764a3a11a0e20073ac5e82fc6692dc))
* upgrade MUI to v7 and related dependencies - Upgrade @mui/material to v7.1.1 - Upgrade @mui/system to v7.1.1 - Upgrade @mui/x-date-pickers to v8.5.2 - Upgrade @emotion/react and @emotion/styled to v11.14.0 - Upgrade date-fns to v4.1.0 - Upgrade @date-io/core to v3.2.0 - Upgrade @date-io/date-fns to v3.2.1 - Fix TypeScript errors in date picker components - Update test snapshots for MUI v7 compatibility - Fix example project configuration for local module resolution - Change locale from Russian to French in example ([d10596b](https://github.com/lookfirst/mui-rff/commit/d10596bd51a6810c0e2869ad3497963074ec3d06))
* upgrade to Yarn 4 - Update package.json files, add .yarnrc.yml, update GitHub Actions, docs and .gitignore ([1fbcd4d](https://github.com/lookfirst/mui-rff/commit/1fbcd4d5e733b0b04b2c8945043bbb81119c09d0))


### Bug Fixes

* add build-example ([1805738](https://github.com/lookfirst/mui-rff/commit/1805738024b379a0fbd5e80f6c815e9c418ddc8a))
* add missing manifest ([9f1a94c](https://github.com/lookfirst/mui-rff/commit/9f1a94c5274f8b1f71cf3d91d9bd511bed62699b))
* add package.json to tabs rule ([76fe1da](https://github.com/lookfirst/mui-rff/commit/76fe1da3471904fb8c67b21129338c84e5f538fe))
* attempt to configure git to get verified commits ([26a0202](https://github.com/lookfirst/mui-rff/commit/26a0202d9cd0ebfbd28bed057c20fad36c9a437e))
* build example wasn't being called ([e473e41](https://github.com/lookfirst/mui-rff/commit/e473e413542f797b163de227ae8799a51ea1e053))
* don't include component in tag ([bbcb13c](https://github.com/lookfirst/mui-rff/commit/bbcb13c3302041bdb63d5be8460bc5597c281174))
* ensure onBlur is passed to MUI Checkbox to correctly set touched state (closes [#1187](https://github.com/lookfirst/mui-rff/issues/1187)) ([67cc8d5](https://github.com/lookfirst/mui-rff/commit/67cc8d59343a0e71eb7e72978564e76bf3f74618))
* ensure onBlur is passed to MUI Radio to correctly set touched state (closes [#1187](https://github.com/lookfirst/mui-rff/issues/1187)) ([831490c](https://github.com/lookfirst/mui-rff/commit/831490c70d2aa3e1955ab3705242b565c9a2038d))
* improve Yarn 4 setup in GitHub Actions ([c59f9a8](https://github.com/lookfirst/mui-rff/commit/c59f9a89d34a26ede4726b57840301668fcd8ad5))
* pass placeholder via textFieldProps for Autocomplete, resolves TS 5.3.3 error (closes [#1098](https://github.com/lookfirst/mui-rff/issues/1098)) ([ff16223](https://github.com/lookfirst/mui-rff/commit/ff16223f8ba201bbbafaf407b550343833bb8cde))
* remove cache for now so that master can build once first. we can add this back later. ([4f6118a](https://github.com/lookfirst/mui-rff/commit/4f6118a554921317a7826390b32abdf0d9423565))
* remove outdated script targets ([ce5c3d0](https://github.com/lookfirst/mui-rff/commit/ce5c3d040228a28cfdd23f632ebc2fee4e4eab23))
* set bootstrap version for release-please ([c2e263d](https://github.com/lookfirst/mui-rff/commit/c2e263d191e6824e3feda5008daa583edf8f8d5f))
* simplify vite config ([aa0c337](https://github.com/lookfirst/mui-rff/commit/aa0c3375ba35537b94dcaf7cf6d25e92b16bcc08))
* update GitHub Actions to properly setup Yarn 4 ([26cb6d5](https://github.com/lookfirst/mui-rff/commit/26cb6d5d6788310c1e3cd95e1fe1bbf95b6ffcc1))
* use relative asset paths for GitHub Pages deployment ([d1d9cbf](https://github.com/lookfirst/mui-rff/commit/d1d9cbf8e639227b33b77bc15bb493899f8ff161))
