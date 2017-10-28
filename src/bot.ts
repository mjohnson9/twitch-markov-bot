/**
 * Module dependencies.
 */
import * as path from "path";

import * as async from "async";
import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import * as tmi from "tmi.js";

import * as chainlink from "./models/ChainLink";
import * as tokenize from "./tokenize";

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: ".env" });

function environmentVariableMissing(name: string) {
    throw new Error(`environment variable ${name} is required`);
}

function checkEnvironmentVariable(name: string) {
    if(process.env[name] == null) {
        environmentVariableMissing(name);
    }
}

checkEnvironmentVariable("MONGODB_URI");
checkEnvironmentVariable("CLIENT_ID");
checkEnvironmentVariable("USERNAME");
checkEnvironmentVariable("OAUTH_TOKEN");
checkEnvironmentVariable("CHANNEL");

class Bot {
    private twitchClient?: tmi.Client;

    constructor() {
        this.setup().catch((err) => {
            let errText: string;
            if(err instanceof Error) {
                errText = err.message;
            } else {
                errText = "" + err;
            }
            console.error(`Bot died with error: ${errText}`);
            process.exit(1);
        });
    }

    private async setup() {
        console.log("connecting to database...");
        await this.connectToMongoDB();
        console.log("connected to database");

        console.log("connecting to Twitch...");
        await this.connectToTwitch();
        console.log("connected to Twitch as " + (this.twitchClient !== undefined ? this.twitchClient.getUsername() : "undefined"));
    }

    private async connectToMongoDB() {
        // we have to explicitly cast the environment variables as strings
        // because the linter doesn't understand that we've checked its
        // existence before running this code
        await mongoose.connect(process.env.MONGODB_URI as string, {
            server: {
                socketOptions: {
                    keepAlive: 15 * 1000,
                },
            },
        });
    }

    private async connectToTwitch() {
        if(this.twitchClient !== undefined) {
            try {
                await this.twitchClient.disconnect();
            } catch(err) {
                // we aren't concerned if it's already disconnected
            }

            this.twitchClient = undefined;
        }

        this.twitchClient = new tmi.Client({
            options: {
                clientId: process.env.CLIENT_ID,
            },
            connection: {
                reconnect: true,
                secure: true,
            },
            identity: {
                username: process.env.USERNAME,
                password: "oauth:" + process.env.OAUTH_TOKEN,
            },
            channels: [
                "#" + process.env.CHANNEL,
            ],
        });

        this.twitchClient.on("action", async (channel: string, userstate: any, message: string, self: boolean) => {
            if(self) { return; }

            try {
                await this.tokenize(`${userstate.username} ${message}`);
                console.log(`[LEARNED] ${userstate.username} ${message}`);
            } catch(err) {
                console.log(`Failed to learn from "${userstate.username} ${message}" -- ${err}`);
            }
        });

        this.twitchClient.on("message", async (channel: string, userstate: any, message: string, self: boolean) => {
            if(self) { return; }

            try {
                await this.tokenize(message);
                console.log(`[LEARNED] ${userstate.username}: ${message}`);
            } catch(err) {
                console.log(`Failed to learn from ${userstate.username}: "${message}" -- ${err}`);
            }
        });

        await this.twitchClient.connect();
    }

    private async tokenize(msg: string) {
        const tokens = tokenize.tokenize(msg);

        return async.forEach(tokens, async (token) => {
            return chainlink.ChainLink.update({fromWord: token.fromWord, toWord: token.toWord}, {$inc: {occurences: 1}}, {upsert: true});
        });
    }
}

/**
 * Connect to MongoDB.
 */
// mongoose.Promise = global.Promise;

const bot = new Bot();
