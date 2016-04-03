var Botkit = require('botkit'),
    controller = Botkit.slackbot();
    bot = controller.spawn({
      token: 'xoxb-31632453633-l9SPxswXuxJUjMz0rJlKNk26'
    });

bot.startRTM(function(err, bot, payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

controller.hears(['joke'], ['direct_message','direct_mention','mention','ambient'], function(bot, message){
  controller.storage.users.get(message.user, function(err, user) {
    bot.startConversation(message, function(err, convo){
      if (!err) {
        convo.ask('Hey '+ message.user + ', have you hear the one about the camel?', function(response, convo){
          if (response.text === 'no') {
            convo.ask('What do you call a camel with three humps?',function(response, convo){
              if (response.text === 'pregnant'){
                convo.say('Wow you\'re good');
              } else {
                convo.say('Pregnant');
              }
              convo.next();
            });
          }
          convo.next();
        });
        convo.on('end', function(convo) {
          bot.reply(message, 'I love telling terrible jokes!');
        });
      }
    });
  });
});
