const Telegraf = require('telegraf')
require('dotenv').config()
const axios = require('axios')

const playlistUrl = `https://streamdj.ru/api/playlist/${process.env.STREAM_DJ_ID}`
const skipUrl = `https://streamdj.ru/api/request_skip/${process.env.STREAM_DJ_ID}/${process.env.STREAM_DJ_TOKEN}`
const needForSkip = process.env.NEED_FOR_SKIP

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

bot.on('poll', (ctx) => {
    if (ctx.poll.options[0].voter_count >= needForSkip) {
        axios.get(skipUrl)
            .then((_) => {
                console.log("success")
            })
            .catch((_) => {
                console.error("error")
            })
    }
})

bot.start((ctx) => ctx.reply('supported commands: /skipCurrent, /playlist'))

bot.command('skipCurrent', (ctx) =>
    ctx.replyWithPoll(
        'Skip current track ?',
        ['Yes', 'No'],
        { is_anonymous: true }
    )
)

bot.command('playlist', (ctx) => {
    axios.get(playlistUrl)
        .then((res) => {
           if (res.data) {
               let answer = '*Playlist* \n'
               for (const data in res.data) {
                   answer = answer.concat('*Author* ', res.data[data].author, ' *Track* ', res.data[data].title, '\n')
               }
               ctx.replyWithMarkdown(answer)
           } else {
               ctx.reply('Playlist is empty')
           }
        })
        .catch((_) => {
            console.error('error')
        })
})

bot.launch()