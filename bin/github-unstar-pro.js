#!/usr/bin/env node

/*
 * Author: Danish Saleem
 * GitHub: mrdanishsaleem
 * name: GitHub Unstar Pro
 * version: 1.0
 */

"use strict";

const { Octokit } = require("@octokit/core");

const PAT = process.env.GITHUB_PAT || "YOUR_PERSONAL_ACCESS_TOKEN_HERE"; // Use environment variable or set your PAT here

async function logic() {
    try {
        const octokit = new Octokit({ auth: PAT });
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

async function unstarPlease() {
    let ran = await logic();
    while (ran) {
        if (!ran) return;
        ran = await logic();
    }
}

unstarPlease();
