import tmi from "tmi.js";
import chalk from "chalk";
import dotenv from "dotenv";


const CHANNEL_NAME = "braiann___";

dotenv.config()

const client = new tmi.Client({
    options: { debug: false },
    identity: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD
    },
    channels: [CHANNEL_NAME]
});

client.connect();

client.on("whisper", (from, userstate, message, self) => {
    console.log(`whisper grom ${from}: `, message)
});

client.on("message", (channel, userstate, message, self) => {

    // if (self) return;

    const isAction = userstate["message-type"] =="action";
    if (isAction) return;
    
    const username = userstate.username;

    const isCommand = message[0] == "!";
    if (isCommand) {
        const command = message.split(" ")[0].toLocaleLowerCase();
        if (command == "!test") {
            client.say(CHANNEL_NAME, "This is a test");
        } else if (command === "!dice") {
            console.log('dice request');
            const number = Math.floor(Math.random() * 6) + 1;
            client.say(CHANNEL_NAME, `${username} has got a  ${number} on the dice!`);
        }

        return;
    }

    const displayName = userstate["display-name"];
    const color = userstate?.color ?? "#FFFFFF";
    const nick = chalk.hex(color).underline(username);
    const mod = userstate?.mod;
    const type = userstate["message-type"];
    const isPrime = userstate.badges?.premium ?? false;
    const isVip = userstate.badges?.vip ?? false;
    const isMod = userstate.badges?.moderator ?? false;
    const isSub = userstate.subscriber ?? false;
    const badgeInfo = userstate?.["badge-info"];
    const badges = 
        (isPrime ? "👑" : "") +
        (isVip ? "💎" : "") +
        (isMod ? "🗡" : "") +   
        (isSub ? "💛" : "");

    
    console.log(`${badges} [${nick}]`, message);

});