import { Command } from "discord-akairo";
import { Message, MessageEmbed} from "discord.js"

export default class PingCommand extends Command {
    public constructor() {
        super("help",{
            aliases: ["help", "h"],
            category: "public",
            description: {
                content: "help command",
                useage: "help",
                exaples: [
                "help"
              ]
            },
            ratelimit: 3
        });
    }

    public exec(message: Message): Promise<Message> {
        return message.util.send(new MessageEmbed()
        .setTitle("help")
        .setDescription("`\`ping\``\n`\`avatar\``\n`\`warn\`")
        );
    }
}