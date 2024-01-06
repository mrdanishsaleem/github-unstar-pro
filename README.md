# GitHub Unstar Pro

This command-line tool simplifies unstar-ing GitHub repositories in bulk. If you've accumulated a multitude of starred repositories over time and want to clean them up effortlessly, this tool is for you.

## Why GitHub Unstar Pro?

When dealing with an extensive list of starred repositories, manually unstar-ing each one can be tedious. Many existing solutions are outdated or require unfamiliar languages. GitHub Unstar Pro streamlines this process using the latest GitHub API.

## Usage

Install the tool globally via npm or yarn:

- `npm i -g github-unstar-pro`
- `yarn global add github-unstar-pro`

Run the command:

```bash
github-unstar-pro
```

Follow the prompts to enter your personal access token generated from your GitHub account. You can generate a personal access token [here](https://github.com/settings/tokens) and make sure to select repo as scope. Once entered, the tool will swiftly unstar all your repositories. For larger collections of starred projects, you may need to rerun the command due to GitHub API limitations.
