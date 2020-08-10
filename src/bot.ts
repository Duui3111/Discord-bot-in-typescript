import { token, owners } from "./Config";
import botClient from "./client/BotClient"; 

const client: botClient = new botClient({ token, owners }); 
client.start();