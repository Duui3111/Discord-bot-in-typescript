import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo";
import { Message } from "discord.js";
import { join } from "path"; 
import { prefix, owners, dbName } from "../Config";
import { Connection } from "typeorm";
import Database from "../structures/Database";
import { promises } from "fs";

declare module "discord-akairo" {
    interface AkairoClient {
        CommandHandler: CommandHandler;
        ListenerHandler: ListenerHandler;
        db: Connection;
    }
}

interface botOptions {
    token?: string;
    owners?: string[];
}

export default class botClient extends AkairoClient {
    public config: botOptions;
    public db!: Connection;

    public ListenerHandler: ListenerHandler = new ListenerHandler(this, {
        directory: join(__dirname, "..", "listeners")
    });

    public CommandHandler: CommandHandler = new CommandHandler(this, {
        directory: join(__dirname, "..", "commands"),
        prefix,
        allowMention: true,
        handleEdits: true,
        commandUtil: true,
        commandUtilLifetime: 3e5,
        defaultCooldown: 6e4,
        ignorePermissions: owners
    });

    public constructor(config: botOptions) {   
        super({
            ownerID: config.owners
        });
        
        this.config = config; 
    }

    private async init(): Promise<void> { 
       this.CommandHandler.useListenerHandler(this.ListenerHandler);
       this.ListenerHandler.setEmitters({
           CommandHandler: this.CommandHandler,
           ListenerHandler: this.ListenerHandler,
           process
       });

       this.CommandHandler.loadAll();
       this.ListenerHandler.loadAll(); 
       this.db = Database.get(dbName);
       await this.db.connect();
       await this.db.synchronize();

    }

    public async start(): Promise<string> {
     await this.init();
     return this.login(this.config.token);
    }
}