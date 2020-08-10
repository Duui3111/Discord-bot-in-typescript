import { Listener } from "discord-akairo";

export default class ReadyListneners extends Listener {
    public constructor() {
        super("ready", {
            emitter: "client",
            event: "ready",
            category: "cliet"
        });
    }

    public exec(): void {
       console.log(`${this.client.user.tag} is now online and ready`);
    }
}