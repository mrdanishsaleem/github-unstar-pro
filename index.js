#!/usr/bin/env node

/*
 * Author: Danish Saleem
 * GitHub: mrdanishsaleem
 * name: GitHub Unstar Pro
 * version: 1.0
 */

"use strict";

const inquirer = require("inquirer");
const { Octokit } = require("@octokit/core");

async function logic(pat) {
    try {
        const octokit = new Octokit({ auth: pat });
        const { data } = await octokit.request(`GET /user/starred`);
        if (Array.isArray(data) && data.length !== 0) {
            for (const item of data) {
                try {
                    await octokit.request("DELETE /user/starred/:owner/:repo", {
                        owner: item.owner.login,
                        repo: item.name,
                    });
                    console.log(`Unstarred: ${item.owner.login}/${item.name}`);
                } catch (deleteErr) {
                    if (deleteErr.status === 404) {
                        console.error(`Repository ${item.owner.login}/${item.name} not found or inaccessible.`);
                    } else {
                        console.error(`Failed to unstar ${item.owner.login}/${item.name}:`, deleteErr.message);
                    }
                }
            }
        } else {
            console.log("No repositories to unstar.");
        }
        return true;
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function unstarPlease(pat) {
    if (!pat) {
        console.log("No token provided. Exiting...");
        return;
    }

    let ran = true;
    while (ran) {
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
