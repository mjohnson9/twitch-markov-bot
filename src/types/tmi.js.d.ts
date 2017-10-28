/// <reference types="node" />

declare module "tmi.js" {
    import events = require("events");

    type LogFunc = (message: string) => void;

    interface ClientOptions {
        connection?: {
            /**
             * Connect to this server
             */
            server?: string;

            /**
             * Connect on this port
             */
            port?: number;

            /**
             * Max number of reconnection attempts
             */
            maxReconnectAttempts?: number;

            /**
             * Max number of ms to delay a reconnection
             */
            maxReconnectInterval?: number;

            /**
             * Whether or not to reconnect
             */
            reconnect?: boolean;

            /**
             * The rate of increase of the reconnect delay
             */
            reconnectDecay?: number;

            /**
             * Number of ms before attempting to reconnect
             */
            reconnectInterval?: number;

            /**
             * Use secure connection (SSL / HTTPS)
             */
            secure?: boolean;

            /**
             * Number of ms to disconnect if no responses from server
             */
            timeout?: number;
        };

        identity?: {
            /**
             * Username on Twitch
             */
            username?: string;

            /**
             * OAuth password on Twitch
             */
            password?: string;
        };

        options?: {
            /**
             * Used to identify your application to the API
             */
            clientId?: string;

            /**
             * Show debug messages in console
             */
            debug?: boolean;
        };

        /**
         * List of channels to join when connected
         */
        channels?: string[];

        /**
         * Custom logger with the methods info, warn, and error
         */
        logger?: {
            error: LogFunc;
            info: LogFunc;
            warn: LogFunc;
        };
    }

    class Client extends events.EventEmitter {
        /**
         * @param options
         * @event action received a /me action from a channel
         * @event ping received a ping request from the server
         * @event subscription a user subscribed or resubscribed
         * @event hosting a channel began hosting another
         * @event ban a user was banned
         * @event timeout a user was timed out
         */
        constructor(options: ClientOptions);

        /**
         * Connect to Twitch using the configured settings
         */
        public connect(): Promise<[string, number]>;

        /**
         * Connect to Twitch using the configured settings
         */
        public disconnect(): Promise<[string, number]>;

        /**
         * Get the current channels
         */
        public getChannels(): string[];

        /**
         * Get the current options
         */
        public getOptions(): ClientOptions;

        /**
         * Get the current username
         */
        public getUsername(): string;

        /**
         * Function to check if user is a mod on a channel
         *
         * @deprecated
         */
        public isMod(channel: string, username: string): boolean;

        /**
         * Get the current state of the socket
         */
        public readyState(): string;
    }
}
