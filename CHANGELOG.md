# Changelog

## [8.1.0](https://github.com/lookfirst/mui-rff/compare/mui-rff-v8.0.4...mui-rff-v8.1.0) (2025-07-05)


### Features

* **173:** add makeValidateSync helper ([8a7495f](https://github.com/lookfirst/mui-rff/commit/8a7495fbeed21086712df26fd274169fcec87967))
* add build-example script ([b928ee9](https://github.com/lookfirst/mui-rff/commit/b928ee98d66fa61e01ccd219655a782a1e9a8dcb))
* add release-please integration ([520eb74](https://github.com/lookfirst/mui-rff/commit/520eb74ee5c4789abded223f0c6a24223a2d3f67))
* add release-please npm package ([e9b0881](https://github.com/lookfirst/mui-rff/commit/e9b08817b6e8b47d0c7512cb2937fc9a53ba9c20))
* add textFieldProps to DatePicker ([23e1b76](https://github.com/lookfirst/mui-rff/commit/23e1b76ad00e077ec857408f99eaa557932f01f1))
* enable freeSolo to be able to add new options ([6bc3679](https://github.com/lookfirst/mui-rff/commit/6bc3679b0734607956d027985efb7025e28233cb))
* update lockfile ([e01525a](https://github.com/lookfirst/mui-rff/commit/e01525a6d5764a3a11a0e20073ac5e82fc6692dc))
* update yup to 1.3.2 ([1e44e12](https://github.com/lookfirst/mui-rff/commit/1e44e12e0b8339e94606a5e5a886f50dcd7ee377))
* update yup to 1.3.2 ([ac4553c](https://github.com/lookfirst/mui-rff/commit/ac4553ccc0201824afef3c208e71329564180b29))
* upgrade MUI to v7 and related dependencies - Upgrade @mui/material to v7.1.1 - Upgrade @mui/system to v7.1.1 - Upgrade @mui/x-date-pickers to v8.5.2 - Upgrade @emotion/react and @emotion/styled to v11.14.0 - Upgrade date-fns to v4.1.0 - Upgrade @date-io/core to v3.2.0 - Upgrade @date-io/date-fns to v3.2.1 - Fix TypeScript errors in date picker components - Update test snapshots for MUI v7 compatibility - Fix example project configuration for local module resolution - Change locale from Russian to French in example ([d10596b](https://github.com/lookfirst/mui-rff/commit/d10596bd51a6810c0e2869ad3497963074ec3d06))
* upgrade to Yarn 4 - Update package.json files, add .yarnrc.yml, update GitHub Actions, docs and .gitignore ([1fbcd4d](https://github.com/lookfirst/mui-rff/commit/1fbcd4d5e733b0b04b2c8945043bbb81119c09d0))


### Bug Fixes

* 455 ([3c10972](https://github.com/lookfirst/mui-rff/commit/3c109725cf7e39babf191c70df9f83e71c9cc776))
* add build-example ([1805738](https://github.com/lookfirst/mui-rff/commit/1805738024b379a0fbd5e80f6c815e9c418ddc8a))
* add missing manifest ([9f1a94c](https://github.com/lookfirst/mui-rff/commit/9f1a94c5274f8b1f71cf3d91d9bd511bed62699b))
* add package.json to tabs rule ([76fe1da](https://github.com/lookfirst/mui-rff/commit/76fe1da3471904fb8c67b21129338c84e5f538fe))
* autocomplete changes from uncontrolled to controlled state ([3453a92](https://github.com/lookfirst/mui-rff/commit/3453a9214566138100a58081c74302356d6ff49a))
* autocomplete changing from uncontrolled to controlled state ([b2c2543](https://github.com/lookfirst/mui-rff/commit/b2c25438486afad688560d813ce687cc6d782c6d))
* autocomplete regression ([6b2ee28](https://github.com/lookfirst/mui-rff/commit/6b2ee2880456052137907c072a5c1feafb73f0b7))
* DatePicker with textFieldProps ([cb5f8ba](https://github.com/lookfirst/mui-rff/commit/cb5f8ba42214c218c01818fabe88b213d4b370df))
* ensure onBlur is passed to MUI Checkbox to correctly set touched state (closes [#1187](https://github.com/lookfirst/mui-rff/issues/1187)) ([67cc8d5](https://github.com/lookfirst/mui-rff/commit/67cc8d59343a0e71eb7e72978564e76bf3f74618))
* ensure onBlur is passed to MUI Radio to correctly set touched state (closes [#1187](https://github.com/lookfirst/mui-rff/issues/1187)) ([831490c](https://github.com/lookfirst/mui-rff/commit/831490c70d2aa3e1955ab3705242b565c9a2038d))
* example packages upgrade ([dfab9c5](https://github.com/lookfirst/mui-rff/commit/dfab9c57f662fd974e4db56beb4404b9510bc72c))
* example react root setup ([4834da0](https://github.com/lookfirst/mui-rff/commit/4834da06147bcc19c23f72ca64322e7a6f73e811))
* externalize peer dependencies in Vite build (fixes [#1191](https://github.com/lookfirst/mui-rff/issues/1191)) ([2fb01fb](https://github.com/lookfirst/mui-rff/commit/2fb01fbb93ee8b5faebf6fa3965dd9ccadace39f))
* ide suggestion to simplify code ([99977de](https://github.com/lookfirst/mui-rff/commit/99977de1a9d73454a78b77ef52bfb9e2513b3b56))
* improve Yarn 4 setup in GitHub Actions ([c59f9a8](https://github.com/lookfirst/mui-rff/commit/c59f9a89d34a26ede4726b57840301668fcd8ad5))
* justify-&gt;justifyContent mui renamed property ([eabe559](https://github.com/lookfirst/mui-rff/commit/eabe559d3f137e65cdbcd75fca03aaf8e6075877))
* pass placeholder via textFieldProps for Autocomplete, resolves TS 5.3.3 error (closes [#1098](https://github.com/lookfirst/mui-rff/issues/1098)) ([ff16223](https://github.com/lookfirst/mui-rff/commit/ff16223f8ba201bbbafaf407b550343833bb8cde))
* postinstall is breaking things for people ([59075da](https://github.com/lookfirst/mui-rff/commit/59075da479318d7a9afafac9a4d460c91a814db8))
* regression and add test for it ([c6bb080](https://github.com/lookfirst/mui-rff/commit/c6bb080b7529f5d864cdb678892ac4fac25ba08a))
* remove cache for now so that master can build once first. we can add this back later. ([4f6118a](https://github.com/lookfirst/mui-rff/commit/4f6118a554921317a7826390b32abdf0d9423565))
* remove outdated script targets ([ce5c3d0](https://github.com/lookfirst/mui-rff/commit/ce5c3d040228a28cfdd23f632ebc2fee4e4eab23))
* removed inputProps interfering with mui's internal refs ([9a7cb80](https://github.com/lookfirst/mui-rff/commit/9a7cb8071af9e37c167e0af2850abcf1f630a001))
* set bootstrap version for release-please ([c2e263d](https://github.com/lookfirst/mui-rff/commit/c2e263d191e6824e3feda5008daa583edf8f8d5f))
* simplify vite config ([aa0c337](https://github.com/lookfirst/mui-rff/commit/aa0c3375ba35537b94dcaf7cf6d25e92b16bcc08))
* style changes (eslint/prettier) ([8979e44](https://github.com/lookfirst/mui-rff/commit/8979e44ead82d7a879ced075316d3187bacdd58b))
* typescript types for value field ([5821c20](https://github.com/lookfirst/mui-rff/commit/5821c20616263dcd2d38262eda4512da7bf1de07))
* typo in interface definition ([6e4e941](https://github.com/lookfirst/mui-rff/commit/6e4e9419fd757b56b5b0c426bdd6a0305f4bfc43))
* update GitHub Actions to properly setup Yarn 4 ([26cb6d5](https://github.com/lookfirst/mui-rff/commit/26cb6d5d6788310c1e3cd95e1fe1bbf95b6ffcc1))
* use relative asset paths for GitHub Pages deployment ([d1d9cbf](https://github.com/lookfirst/mui-rff/commit/d1d9cbf8e639227b33b77bc15bb493899f8ff161))
* use yarn run ([3e7550f](https://github.com/lookfirst/mui-rff/commit/3e7550f60229ef44175b3dd05f493e576478db8f))
