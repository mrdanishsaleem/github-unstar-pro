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

async function logic(pat) {
    try {
        const octokit = new Octokit({ auth: pat });
        const { data } = await octokit.request(`GET /user/starred`);
        if (Array.isArray(data) && data.length !== 0) {
            data.forEach(async (item) => {
                await octokit.request("DELETE /user/starred/{owner}/{repo}", {
                    owner: item.owner.login,
                    repo: item.name,
                });
            });
            return true;
        }
        return false;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function unstarPlease(pat) {
    let ran = await logic(pat);
    while (ran) {
        if (!ran) return;
        ran = await logic(pat);
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
