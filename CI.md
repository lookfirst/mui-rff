# CI Setup

This repository uses GitHub Actions for pull request validation and post-merge releases.

Workflow files:

- `.github/workflows/ci.yml`
- `.github/workflows/release-on-merge.yml`
- `.github/workflows/release.yml`

## GitHub Setup

### 1. Create the GitHub App

The release workflow uses the GitHub App `mui-rff-release-bot`.

Configure it with:

- install target: `lookfirst/mui-rff`
- repository permission: `Contents: Read and write`

Create and manage it in GitHub at:

- `Settings` -> `Developer settings` -> `GitHub Apps`

After creating the app:

- use `Install App` to install it on `lookfirst/mui-rff`
- use `Generate a private key` to create the `.pem` file

Add these repository Actions settings:

- variable `RELEASE_APP_ID`
- secret `RELEASE_APP_PRIVATE_KEY`

Find the App ID in GitHub at:

- `Settings` -> `Developer settings` -> `GitHub Apps` -> `mui-rff-release-bot`

Useful `gh` commands:

- `gh variable set RELEASE_APP_ID --repo lookfirst/mui-rff --body "<APP_ID>"`
- `gh secret set RELEASE_APP_PRIVATE_KEY --repo lookfirst/mui-rff < /path/to/private-key.pem`
- `gh variable list --repo lookfirst/mui-rff`
- `gh secret list --repo lookfirst/mui-rff`

### 2. Configure branch protection / rulesets

After the app is installed, configure the `master` ruleset.

Find rulesets in GitHub at:

- `Settings` -> `Rules` -> `Rulesets`

Expected setup:

- target branch: `master`
- require pull requests for normal changes
- add `mui-rff-release-bot` as a bypass actor
- bypass mode: `always`

Without this bypass, the automated version bump commit cannot push back to `master`.

Useful `gh` commands:

- `gh api repos/lookfirst/mui-rff/rulesets`
- `gh api repos/lookfirst/mui-rff/rulesets/<RULESET_ID>`

### 3. Configure npm Trusted Publishing

Configure npm Trusted Publishing for:

- owner: `lookfirst`
- repository: `mui-rff`
- workflow filename: `release-on-merge.yml`

`NPM_TOKEN` is not used anymore.

Setup steps on npm:

- open the `mui-rff` package on npmjs.com
- go to package `Settings`
- open the `Trusted Publisher` section
- choose `GitHub Actions`
- enter:
  - `Organization or user`: `lookfirst`
  - `Repository`: `mui-rff`
  - `Workflow filename`: `release-on-merge.yml`
- save the trusted publisher

Notes:

- enter only the workflow filename, not the full path
- the filename must match exactly
- because this repo uses a reusable workflow, npm validates the calling workflow name
- trusted publishing requires GitHub-hosted runners
- trusted publishing requires `id-token: write`

### 4. Configure GitHub Pages

The release workflow deploys the example site to GitHub Pages.

Requirements:

- Pages enabled for the repository
- `github-pages` environment available

## General `gh` Commands

- `gh auth status`
- `gh repo view lookfirst/mui-rff`
- `gh workflow view ci.yml --repo lookfirst/mui-rff`
- `gh workflow view release-on-merge.yml --repo lookfirst/mui-rff`
- `gh workflow view release.yml --repo lookfirst/mui-rff`

## Workflow Behavior

### Pull requests

`ci.yml` runs on pull requests to `master`.

It runs:

- `bun install --frozen-lockfile`
- `bun run ci`

This is the only workflow that runs the full CI suite.

### After merge

`release-on-merge.yml` runs when a PR is merged into `master`.

It calls `release.yml` with the merge commit SHA.

### Release steps

`release.yml` does the following:

1. create a GitHub App token
2. check out the merge commit
3. install dependencies
4. determine the next version from commit messages
5. update `package.json`
6. commit and tag the release
7. push the bump commit to `master`
8. create the GitHub release
9. build the package
10. build the example
11. deploy GitHub Pages
12. publish to npm

Version bump rules:

- `feat!: remove deprecated prop` => major
- `feat:` => minor
- everything else => patch

Versioning is based on Conventional Commit subjects since the last tag.

## Notes

### Protected branch push rejected

- Check that `mui-rff-release-bot` is in the `master` ruleset bypass list.

### `src refspec master does not match any`

- The release workflow runs from a detached `HEAD`.
- Pushes must use `git push origin HEAD:master`.

### npm publish authorization failures

- Check npm Trusted Publishing configuration.
- The workflow filename must be `release-on-merge.yml`.
