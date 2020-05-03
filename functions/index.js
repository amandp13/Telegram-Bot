const functions = require('firebase-functions');
const { Telegraf } = require('telegraf')
const apixu = require('apixu');

let config = require('./env.json');

if (Object.keys(functions.config()).length) {
    config = functions.config();
  }
  const apixuClient = new apixu.Apixu({
    apikey: config.service.apixu_key
  });
  
  const bot = new Telegraf(config.service.telegram_key)
bot.start((ctx) => ctx.reply('Welcome'));
bot.on('text', (ctx) => {
  let query = ctx.update.message.text;
  apixuClient.current(query).then((current) => {
    return ctx.reply(
      `The current weather in ${query} is C: ${current.current.temp_c} F:${current.current.temp_f}`);
  }).catch((err) => {
    return ctx.reply('This city does not exists', err);
  });
});
// bot.context.db = {
//   getScores: () => { return 'welcome' }
// }
// bot.on('text', (ctx) => {
//   const scores = ctx.db.getScores(ctx.message.from.username)
//   return ctx.reply(`${ctx.message.from.username}: ${scores}`)
// })

bot.launch()


exports.helloWorld = functions.https.onRequest((request, response) => {
        apixuClient.current('London').then((current) => { 
            return response.send(current);
        }).catch((err)=>{ return response.send(err);
        });
               //  response.send("Hello from Firebase!");
});
