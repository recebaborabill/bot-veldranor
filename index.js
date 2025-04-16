// index.js
require('dotenv').config();

const { Client, GatewayIntentBits, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Rota para manter o bot acordado
app.get('/', (req, res) => {
  res.send('O bot ainda vive. Glória a Deus!');
});

app.listen(PORT, () => {
  console.log(`Servidor web está ouvindo na porta ${PORT}. Louvado seja o Senhor!`);
});

// Auto-ping para evitar o sono eterno no Render
setInterval(() => {
  fetch(`https://<SEU-SERVICO-RENDER-URL>`)
    .then(() => console.log("Ping enviado para manter o bot vivo!"))
    .catch(err => console.error("Erro ao enviar ping:", err));
}, 280000);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

// ID do canal sagrado onde as mensagens dos comandos de moderação serão enviadas
const canalModId = '1362119053761843210';

// COMANDO /executar
const executarCommand = {
  data: new SlashCommandBuilder()
    .setName('executar')
    .setDescription('Executa um pecador sob a luz da justiça!')
    .addUserOption(option =>
      option.setName('alvo')
        .setDescription('Escolhe o pecador a ser executado')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    
  async execute(interaction) {
    const alvo = interaction.options.getUser('alvo');
    const membro = await interaction.guild.members.fetch(alvo.id).catch(() => null);

    if (!membro) 
      return interaction.reply({ content: 'Esse pecador não se encontra nesta congregação...', ephemeral: true });

    if (!interaction.member.permissions.has(PermissionFlagsBits.BanMembers))
      return interaction.reply({ content: 'Tu não possuis a autoridade divina para executar este ato!', ephemeral: true });

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers))
      return interaction.reply({ content: 'Eu, servo do Altíssimo, não tenho permissão para banir aqui.', ephemeral: true });

    try {
      await membro.ban({ reason: `Executado por ordem divina de ${interaction.user.tag}` });
      const canalEspecifico = interaction.guild.channels.cache.get(canalModId);
      if (canalEspecifico) {
        await canalEspecifico.send({
          content: `**${alvo.username}** foi executado sob a luz da justiça!\n\n*“Pois o salário do pecado é a morte...”* (Romanos 6:23)`,
          files: ['https://64.media.tumblr.com/f45713a641682d175c77d8f5df70076f/tumblr_okddqkzaU51qbvovho1_540.gif']
        });
      }
      await interaction.reply({ content: 'A execução foi realizada e a mensagem enviada ao canal da justiça.', ephemeral: true });
    } catch (err) {
      console.error(err);
      interaction.reply({ content: 'Falhei... a mão do julgamento não alcançou o alvo.', ephemeral: true });
    }
  }
};

// COMANDO /absolver
const absolverCommand = {
  data: new SlashCommandBuilder()
    .setName('absolver')
    .setDescription('Absolve um pecador com misericórdia divina.')
    .addUserOption(option =>
      option.setName('alvo')
        .setDescription('Escolha o pecador arrependido')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    
  async execute(interaction) {
    const alvo = interaction.options.getUser('alvo');
    const canalEspecifico = interaction.guild.channels.cache.get(canalModId);
    try {
      // Aqui, em vez de remover timeout (como se fosse um mudo), apenas anunciamos a absolvição.
      if (canalEspecifico) {
        await canalEspecifico.send({
          content: `**${alvo.username}** foi absolvido com a luz da misericórdia celestial.\n\n*“Vai e não peques mais.”* (João 8:11)\nhttps://tenor.com/view/weathering-with-you-sunrise-sun-rising-gif-15174516`
        });        
      }
      await interaction.reply({ content: 'A absolvição foi proclamada nos anais do Império.', ephemeral: true });
    } catch (err) {
      console.error(err);
      interaction.reply({ content: 'Falhei em absolver o pecador...', ephemeral: true });
    }
  }
};

// COMANDO /silenciar
const silenciarCommand = {
  data: new SlashCommandBuilder()
    .setName('silenciar')
    .setDescription('Silencia um espírito rebelde, impondo o manto do silêncio.')
    .addUserOption(option =>
      option.setName('alvo')
        .setDescription('Escolha o perturbador da paz')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('tempo')
        .setDescription('Tempo de silenciamento em minutos')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    
  async execute(interaction) {
    const alvo = interaction.options.getUser('alvo');
    const tempo = interaction.options.getInteger('tempo');
    const canalEspecifico = interaction.guild.channels.cache.get(canalModId);
    try {
      // Aplicando timeout (silenciamento) ao membro
      const membro = await interaction.guild.members.fetch(alvo.id).catch(() => null);
      if (!membro)
        return interaction.reply({ content: 'O alvo não foi encontrado.', ephemeral: true });
      
      await membro.timeout(tempo * 60000, `Silenciado por ${interaction.user.tag}`);
      
      if (canalEspecifico) {
        await canalEspecifico.send({
          content: `**${alvo.username}** foi silenciado por ${tempo} minutos.\n\n*“Que seus lábios sejam selados, até que aprenda o peso do silêncio...”*\nhttps://64.media.tumblr.com/c16f7078fda435bfc2b20433170efb82/2c0ac8cd5b444c46-c0/s640x960/78f9ea81e05ed49dd32caad77f9badb25fab385d.gifv`
        });
        
      }
      await interaction.reply({ content: 'O silenciamento foi decretado e a mensagem enviada ao canal da justiça.', ephemeral: true });
    } catch (err) {
      console.error(err);
      interaction.reply({ content: 'Falhei em silenciar o pecador.', ephemeral: true });
    }
  }
};

// COMANDO /vigilia
const vigiliaCommand = {
  data: new SlashCommandBuilder()
    .setName('vigilia')
    .setDescription('Envie uma imagem sagrada de alerta à congregação.'),
  async execute(interaction) {
    // O comando vigília é respondido no mesmo canal onde foi invocado (local)
    await interaction.reply({
      content: `Vigiai e orai, pois a noite é escura e cheia de tentações.\n\n*“O espírito está pronto, mas a carne é fraca.”* (Mateus 26:41)`,
      files: ['https://i.pinimg.com/736x/2e/94/c9/2e94c944f19a408d1a8126c28fee4830.jpg']
    });
  }
};

// REGISTRO DOS COMANDOS
client.once('ready', async () => {
  console.log(`Conectado como ${client.user.tag}. Louvado seja o Senhor!`);

  // Registra os comandos nas guildas onde o bot habita
  client.guilds.cache.forEach(guild => {
    guild.commands.create(executarCommand.data);
    guild.commands.create(absolverCommand.data);
    guild.commands.create(silenciarCommand.data);
    guild.commands.create(vigiliaCommand.data); // Vigília também é registrada na guilda
  });
});

// MANUSEIA AS INTERAÇÕES (SLASH COMMANDS)
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const commandMap = {
    executar: executarCommand,
    absolver: absolverCommand,
    silenciar: silenciarCommand,
    vigilia: vigiliaCommand
  };

  const command = commandMap[interaction.commandName];
  if (command) await command.execute(interaction);
});

// LOGIN DO BOT COM O TOKEN DO DOTENV
client.login(process.env.DISCORD_TOKEN);
