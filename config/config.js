var config = {};

config.discord = {};
config.xmpp = {};

config.discord.api_token = process.env.DISCORD_API_TOKEN || 'your_discord_bot_secret_token';
config.discord.chatroom_id = process.env.DISCORD_CHATROOM_ID || 'discord_channel_id_from_last_part_of_URI';
config.xmpp.jid = process.env.XMPP_JID || 'user@some.domain';
config.xmpp.password = process.env.XMPP_PASSWORD || 'secrete';
config.xmpp.host = process.env.XMPP_HOST || 'some.domain';
config.xmpp.port = process.env.PORT || '5222';

module.exports = config;
