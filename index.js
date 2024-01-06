#!/usr/bin/env node

/*
 * Author: Danish Saleem
 * GitHub: mrdanishsaleem
 * name: GitHub Unstar Pro
 * version: 2.0.2
 */

"use-strict";

const inquirer = require("inquirer");
const { Octokit } = require("@octokit/core");

async function unstarRepositories(pat, repositories) {
    const octokit = new Octokit({ auth: pat });

    for (const repo of repositories) {
        try {
            await octokit.request("DELETE /user/starred/{owner}/{repo}", {
                owner: repo.owner.login,
                repo: repo.name,
            });
            console.log(`Unstarred: ${repo.owner.login}/${repo.name}`);
        } catch (deleteErr) {
            if (deleteErr.status === 404) {
                console.error(`Repository ${repo.owner.login}/${repo.name} not found or inaccessible.`);
            } else {
                console.error(`Failed to unstar ${repo.owner.login}/${repo.name}:`, deleteErr.message);
            }
        }
    }
}

async function unstarPlease(pat) {
    try {
        const octokit = new Octokit({ auth: pat });
        const { data } = await octokit.request(`GET /user/starred`);

        if (Array.isArray(data) && data.length !== 0) {
            await unstarRepositories(pat, data);
        } else {
            console.log("No repositories to unstar.");
        }
    } catch (err) {
        console.error(err);
    }
}

inquirer
    .prompt([
        {
            type: "input",
            name: "pat",
            message: "Please enter your Personal access token:",
            default: "",
        },
    ])
    .then(function ({ pat }) {
        unstarPlease(pat);
    })
    .catch(function (error) {
        if (error.isTtyError) console.error(error.isTtyError, error);
        console.error(error);
    });
