const figlet = require('figlet');
const Discord = require('discord.js');

module.exports = {
    name: "글자변경",
    description: "Converts text to ascii",

    async run (client, message, args){
        const noArgs = new Discord.MessageEmbed()
        .setTitle(':x: Missing arguments')
        .setColor(0xFF0000)
        .setDescription('변환할 올바른 영어나 기호를 입력 해주세요')
        .setTimestamp()

        if(!args[0]) return message.channel.send(noArgs);

        msg = args.join(" ");

        figlet.text(msg, function (err, data){
            if(err){
                console.log('**오류 발생**');
                console.dir(err);
            }
            if(data.length > 2000) return message.channel.send('오류 2000자 미만의 글자만 변환할 수 있습니다')

            message.channel.send('```' + data + '```') //1 옆에 있는 기호 ` 이거 3개 적으시면 됩니다
        })
    }
}