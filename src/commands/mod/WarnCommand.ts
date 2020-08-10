import { Command } from "discord-akairo"
import{ Message, GuildMember } from "discord.js";
import { Repository } from "typeorm"

import { Warns } from "../../models/Warns"

export default class WarnCommand extends Command {
    public constructor() {
        super("warn",{
            aliases: ["warn"],
            category: "public",
            description: {
                content: "warn command",
                useage: "warn [member] <thing>",
                exaples: [
                "warn"
              ]
            },
            ratelimit: 3,
            userPermissions: ["BAN_MEMBERS", "KICK_MEMBERS"],
            args: [
                {
                    id: "member",
                    type: "member",
                    prompt: {
                        start: (msg: Message) => `${msg.author}, warn someone`,
                        retry:(msg: Message) => `${msg.author}, a vaiid member`
                    }           
                },
                {
                    id: "reason",
                    type: "string",
                    match: "rest",
                    default: "no reason provided"
                }
            ]
        });
    }

    public async exec(message: Message, {member, reason}: {member: GuildMember, reason: string}): Promise<Message> {
        const warnRepo: Repository<Warns> = this.client.db.getRepository(Warns);

        if(member.roles.highest.position >= message.member.roles.highest.position && message.author.id !== message.guild.ownerID)
        return message.util.reply("this user cant be warned");       
        
        await warnRepo.insert({
            guild: message.guild.id,
            user: member.id,
            moderator: message.author.id,
            reason: reason
        });

        const user = message.mentions.members.first()
        user.send(`You have been warned in **${message.guild.name}** for ${reason}`)
        return message.util.send(`**${member.user.tag}** has been Warned by **${message.author.tag}** for *${reason}*`);
    }
}