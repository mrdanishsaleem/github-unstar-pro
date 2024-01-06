#!/usr/bin/env node

/*
 * Author: Danish Saleem
 * GitHub: mrdanishsaleem
 * name: GitHub Unstar Pro
 * version: 1.0
 */

"use strict";

const { Octokit } = require("@octokit/core");
const readline = require("readline");

async function logic(token) {
    try {
        const octokit = new Octokit({ auth: token });
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

async function promptForToken() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question("Please enter your Personal Access Token: ", (token) => {
            rl.close();
            resolve(token);
        });
    });
}

async function unstarPlease() {
    const token = await promptForToken();
    if (!token) {
        console.log("Token not provided. Exiting...");
        return;
    }

    let ran = await logic(token);
    while (ran) {
        if (!ran) return;
        ran = await logic(token);
    }
}

unstarPlease();
