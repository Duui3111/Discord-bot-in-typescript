import { Command } from "discord-akairo"
import{ Message, GuildMember, MessageEmbed } from "discord.js";
import { Repository } from "typeorm"

import { Warns } from "../../models/Warns"
import { User } from "discord.js";

export default class WarningsCommand extends Command {
    public constructor() {
        super("warnings",{
            aliases: ["warnings"],
            category: "public",
            description: {
                content: "warnings command",
                useage: "warnings",
                exaples: [
                "warnings"
            ]
        },
            ratelimit: 3,
            userPermissions: ["BAN_MEMBERS", "KICK_MEMBERS"],
            args: [
                {
                    id: "member",
                    type: "member",
                    default: (msg: Message) => msg.member
                }
            ]
       });
    }
    
    public async exec(message: Message, {member}: {member: GuildMember}): Promise<Message> {
        const warnRepo: Repository<Warns> = this.client.db.getRepository(Warns);
        const warns: Warns[] = await warnRepo.find({user: member.id, guild: message.guild.id});

        if(!warns.length) return message.util.reply("no warning found");

        const warning  = await Promise.all(warns.map(async (v: Warns, i: number)=>{
            const mod: User = await this.client.users.fetch(v.moderator).catch(() => null);
            if(mod) return {
                index: i + 1,
                moderator: mod.tag,
                reason: v.reason
            }
        }));

        return message.util.send(new MessageEmbed()
        .setAuthor(`warnings | ${member.user.username}`, member.user.displayAvatarURL())
        .setColor("RED")
        .setDescription(warning.map(v => `\`#${v.index}\` | Mod: *${v.moderator}*\nReason: *${v.reason}*\n`))
        )

    }
}