/**
 * Module dependencies.
 */
import * as path from "path";

import * as dotenv from "dotenv";
import * as mongoose from "mongoose";
import * as tmi from "tmi.js";

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
checkEnvironmentVariable("OAUTH_TOKEN");
checkEnvironmentVariable("CHANNEL");

class Bot {
    private db: mongoose.Connection;
    private twitchClient: tmi.Client;

    constructor() {
        this.setup().catch(() => {
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
        console.log("connected to Twitch");
    }

    private async connectToMongoDB() {
        this.db = await mongoose.createConnection(process.env.MONGODB_URI, {
            server: {
                socketOptions: {
                    keepAlive: 15 * 1000,
                },
            },
        });
    }

    private async connectToTwitch() {
        if(this.twitchClient != null) {
            try {
                await this.twitchClient.disconnect();
            } catch(err) {
                // we aren't concerned if it's already disconnected
            }

            this.twitchClient = null;
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

        this.twitchClient.on("action", (channel, userstate, message, self) => {
            if(self) { return; }

            this.tokenize(`${userstate.username} ${message}`);
        });

        this.twitchClient.on("action", (channel, userstate, message, self) => {
            if(self) { return; }

            this.tokenize(message);
        });

        await this.twitchClient.connect();
    }

    private tokenize(msg: string) {
        console.log(`Would tokenize: ${msg}`);
    }
}

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;

const bot = new Bot();
