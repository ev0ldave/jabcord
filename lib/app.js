#!/usr/bin/env node


// instance declarations
const Config = require('../config/config');
const Discord = require('discord.js');
const Xmpp = require('node-xmpp-client');

var discord_client = new Discord.Client({
    autoreconnect: true
});
var discord_channel = new Discord.TextChannel({
    id: Config.discord.chatroom_id,
    client: 'relay-bot'
});

var jabber = new Xmpp({
    host: Config.xmpp.host,
    jid: Config.xmpp.jid,
    password: Config.xmpp.password,
    port: Config.xmpp.port,
    preferredSaslMechanism: 'PLAIN',
    reconnect: true,
});

// Create connection to discord
discord_client.login(Config.discord.api_token).catch(function(error) {
    console.log(error);
});
discord_client.on('ready', function () {
    console.log('Connection to Discord established.');
});

//set status available on connection to xmpp server
jabber.on('online', function () {
    console.log('Logged into XMPP server as ' + jabber.jid + '.');
    jabber.send(new Xmpp.Stanza('presence', {
        type: 'available'
    }));
});

// relay messages from jabber server to Discord
jabber.on('stanza', function (stanza) {
    if (stanza.is('message') && stanza.attrs.type !== 'error') {
        var message_body = stanza.getChild('body');
        if (!message_body) return;
        // create message for discord channel
        var message = '@everyone **`[' + stanza.attrs.from.split('@')[0] + ']`** ' + message_body.getText();
        discord_channel.sendMessage(message);
    }
});

jabber.on('error', function (e) {
    console.error(e);
});

jabber.connection.socket.setTimeout(0)
jabber.connection.socket.setKeepAlive(true,60000)

//service shutdown cleanup
process.on('SIGINT', function (code) {
    console.log('shutting down')
    jabber.send(new Xmpp.Stanza('presence', {
        type: 'unavailable'
    }));
    jabber.end()
    discord_client.destroy().catch(function(error) {
        console.log(error)
    });
    setTimeout(function () {
        process.exit()
    }, 1000);
});
