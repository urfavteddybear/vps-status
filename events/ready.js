const { Client, MessageEmbed } = require("discord.js");
const { channelId } = require("../config.json");
const si = require('systeminformation');
const os = require("os");
const pretty = require('prettysize');
const moment = require("moment");
require("moment-duration-format");
/**
 * 
 * @param {Client} client 
 */
module.exports = async (client, message) => {
    client.manager.init(client.user.id);
    console.log(`${client.user.username} online!`);

    const channel = await client.channels.fetch(channelId)


    let cl = await si.currentLoad();
    const embed = new MessageEmbed()
        .setColor("#2F3136")
        .setDescription("Please wait for a minute!\nStatus is being ready!")
    channel.bulkDelete(10);
    channel.send({ embeds: [embed] }).then((msg) => {
        setInterval(async () => {

            let netdata = await si.networkStats();
            let memdata = await si.mem();
            let diskdata = await si.fsSize();
            let osdata = await si.osInfo();

            let cpudata = await si.cpu();
            let uptime = await os.uptime();

            const rembed = new MessageEmbed()

                .setDescription(`__**Server Information**__`)
                .addFields([

                    { name: "**CPU**", value: `\`\`\`nim\nCpu: ${cpudata.manufacturer + " " + cpudata.brand}\nLoad: ${cl.currentLoad.toFixed(2)}%\nCores: ${cpudata.cores}\nPlatform: ${osdata.platform}\`\`\``, inline: true },
                    { name: "**RAM**", value: `\`\`\`nim\nAvailable: ${pretty(memdata.total)}\nMemory Used: ${pretty(memdata.active)}\`\`\``, inline: true },
                    { name: "**DISK**", value: `\`\`\`nim\nDisk Used: ${pretty(diskdata[0].used)} / ${pretty(diskdata[0].size)}\`\`\``, inline: true },
                    { name: "**NETWORK**", value: `\`\`\`nim\nUp: ${pretty(netdata[0].tx_sec)}/s\nDown: ${pretty(netdata[0].rx_sec)}/s\n\nTotal Up: ${pretty(netdata[0].tx_bytes)}\nTotal Down: ${pretty(netdata[0].rx_bytes)}\`\`\`` },
                    { name: "**Discord API websocket ping**", value: `\`\`\`nim\n${Math.round(client.ws.ping)}ms\`\`\``, inline: true },
                    { name: "**Uptime**", value: `\`\`\`nim\n${uptimer(uptime)}\`\`\``, inline: true }
                ])
                .setColor("#2F3136")
                .setFooter({ text: `Updated every 30 seconds` })
                .setTimestamp(Date.now());
            msg.edit({ embeds: [rembed] });



        }, 30000);
    })

}

function uptimer(seconds) {
    seconds = seconds || 0;
    seconds = Number(seconds);
    seconds = Math.abs(seconds);

    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var parts = new Array();

    if (d > 0) {
        var dDisplay = d > 0 ? d + ' ' + (d == 1 ? "day" : "days") : "";
        parts.push(dDisplay);
    }

    if (h > 0) {
        var hDisplay = h > 0 ? h + ' ' + (h == 1 ? "hour" : "hours") : "";
        parts.push(hDisplay)
    }

    if (m > 0) {
        var mDisplay = m > 0 ? m + ' ' + (m == 1 ? "minute" : "minutes") : "";
        parts.push(mDisplay)
    }

    if (s > 0) {
        var sDisplay = s > 0 ? s + ' ' + (s == 1 ? "second" : "seconds") : "";
        parts.push(sDisplay)
    }

    return parts.join(', ', parts);
}
function formatBytes(bytes) {
    if (bytes === 0) return "0 B";
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    return `${(
        bytes / Math.pow(1024, Math.floor(Math.log(bytes) / Math.log(1024)))
    ).toFixed(2)} ${sizes[Math.floor(Math.log(bytes) / Math.log(1024))]}`;
}
