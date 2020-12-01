const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.token;

const { readdirSync } = require('fs');
const { join } = require('path');

client.commands = new Discord.Collection();

const prefix = '/' //자신의 프리픽스


const commandFile = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith("js"));

for (const file of commandFile) {
  const command = require(join(__dirname, "commands", `${file}`));
  client.commands.set(command.name, command);
}

client.on("error", console.error);

client.on('ready', () => {
  console.log(`${client.user.id}로 로그인 성공!`); //
  client.user.setActivity('/help 를 적어보세요!') //상태메시지
});

let MuteRole = '783208323893690390'
let Cooltime_Mute = 3 * 1000 //밀리세컨드 
// 3초내에 칠 시 뮤트
let User_Mute_Object = {}
client.on('message', async message => {
  if (message.author.bot || !message.guild) return
  MuteRole = message.guild.roles.cache.find(r => r.id == MuteRole)
  const M_Author = message.author
  if (!message.member.hasPermission('ADMINISTRATOR')) {
    let Author_Object = User_Mute_Object[M_Author.id]
    if (!Author_Object) {
      User_Mute_Object[M_Author.id] = {
        time: 0,
        interval: null,
        muted: false
      }
    } else {
      if (Author_Object.interval != null) {
        if (Cooltime_Mute >= Author_Object.time && !Author_Object.muted) {
          message.member.roles.add(MuteRole)
          Author_Object.muted = true
          message.reply(`도배하지마셈 씨발 님 뮤트드셈 전 채팅과의 시간차 ${Author_Object.time}ms`)
        }
        clearInterval(Author_Object.interval)
        Author_Object.interval = null
      } else if (!Author_Object.muted) {
        Author_Object.interval = setInterval(() => {
          Author_Object.time++
        }, 1)
      }
      Author_Object.time = 0
    }
  }
  if (message.member.hasPermission('ADMINISTRATOR') && /!언뮤트 <@!?(\d{17,19})>/g.test(message.content)) {
    const Mention_member = message.mentions.members.first()
    Mention_member.roles.remove(MuteRole)
    User_Mute_Object[Mention_member.id].muted = false
    User_Mute_Object[Mention_member.id].time = 0
    message.channel.send(`${Mention_member}, 해방되었어요 ㅊㅋ 드립니다!`)
  }
})


client.on('message', (message) => {
  if(message.content === '/박서진') {
      message.reply('내가 박서진임 ㅅㄱ ㅋ')
  }
});

client.on('message', async message => {

  let blacklisted = ["/help", "/도와줘"]

  let foundInText = false;
  for (var i in blacklisted) { 
    if (message.content.toLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true
  }

  if (foundInText) {
      const user = message.author.id;
      const embed = new Discord.MessageEmbed()
      .setColor('#FF0000')
      .setDescription(`<@${user}>명령어 목록입니다
      
      /코로나 all 
      코로나사이트를 보여줍니다

      /코로나 '나라이름' (나라이름 영어 ex : US)
      해당 나라의 코로나정보를 알려줍니다

      /핑 
      서버의 핑을 보여줍니다
                                                                
      /글자변경 '변환할 영어'
      변환된 영어를 보여줍니다
      
      /날씨 '지역이름'
      지역의 날씨, 온도 등을 를 보여줍니다`);

      message.channel.send(embed)
    }
  }
); 
function checkPermission(message) {
if (!message.member.hasPermission("MANAGE_MESSAGES")) {
  message.channel.send(`<@${message.author.id}> 명령어를 수행할 관리자 권한을 소지하고 있지않습니다.`)
  return true
} else {
  return false
}
}

client.on('message', async message => {

  let blacklisted = ["/코로나 all", "/zhfhsk all"]

  let foundInText = false;
  for (var i in blacklisted) { 
    if (message.content.toLowerCase().includes(blacklisted[i].toLowerCase())) foundInText = true
  }

  if (foundInText) {
      const user = message.author.id;
      const embed = new Discord.MessageEmbed()
      .setColor('#FF0000')
      .setDescription(`<@${user}>코로나 실시간 확인 : https://corona-live.com/`)
      message.channel.send(embed)
    }
  }
);


client.on('messageDelete', async message => {
  let img = message.author.avatar ? `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=256` : undefined;
  let embed = new Discord.MessageEmbed()
  .setTitle('메세지 삭제로그')

  .setColor('#FF0000')

  .addField('로그타입', 'Deleted Message')

  .addField('메세지 삭제하신분:', message.author.tag)

  .addField('채널:', message.channel.name)

  .addField('삭제한 내용:',message.content)

  .setFooter(message.author.tag, img)

  message.channel.send(embed)

}) // 메세지 삭제로그 (embed)

client.on('messageUpdate', async(oldMessage, newMessage) => {
    if(oldMessage.content === newMessage.content) return // 임베드로 인한 수정같은 경우 
    let img = oldMessage.author.avatar ? `https://cdn.discordapp.com/avatars/${oldMessage.author.id}/${oldMessage.author.avatar}.webp?size=256` : undefined;
    let embed = new Discord.MessageEmbed()
    .setTitle('메세지 수정로그')
    .setColor('#FF0000')
    .addField('로그타입', 'Edited Message')
    .addField('메세지 수정하신분:', oldMessage.author.tag)
    .addField('채널:', oldMessage.channel.name)
    .addField('수정하기전 메세지:', oldMessage.content)
    .addField('수정한 후 메세지:', newMessage.content)
    .setFooter(oldMessage.author.tag, img)
    .setTimestamp()
  
    oldMessage.channel.send(embed)
  }) // 메세지 수정로그


client.on("message", async message => {

  if(message.author.bot) return;
  if(message.channel.type === 'dm') return;

  if(message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/);

    const command = args.shift().toLowerCase();

    if(!client.commands.has(command)) return;

    try {
      client.commands.get(command).run(client, message, args);
    } catch (error) {
      console.error(error);
    }
  }
})



client.login(token);