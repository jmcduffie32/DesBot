var Botkit = require('botkit'),
    jokeGenerator = require('./jokeGenerator'),
    controller = Botkit.slackbot(),
    bot = controller.spawn({
      token: ''
    }),
    convoOptions = ['direct_message','direct_mention','mention','ambient','message_received'];

bot.startRTM(function(err, bot, payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

controller.hears(['joke'], convoOptions, function(bot, message){
  controller.storage.users.get(message.user, function(err, user) {
    bot.startConversation(message, function(err, convo){
      if (!err) {
        var joke = jokeGenerator.getJoke();
        convo.ask('Hey '+ message.user + ', have you heard the one about the '+ joke.topic +'?', function(response, convo){
          if (response.text === 'no') {
            convo.ask(joke.setup, function(response, convo){
              if (response.text === joke.punchline){
                convo.say('Wow you\'re good');
              } else {
                convo.say(joke.punchline);
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

controller.hears(['teach'], convoOptions, function(bot, message){
  var newJoke = {};

  bot.startConversation(message, function(err, convo){
    convo.say('Teach me a joke by telling me the setup, punchline, and a brief topic for the joke');
    convo.ask('What is the setup?', function(response, convo){
        newJoke.setup = response.text;
        convo.ask('What is the punchline', function(response, convo){
          newJoke.punchline = response.text;
          convo.ask('What is the topic', function(response, convo){
            newJoke.topic = response.text;
            jokeGenerator.createJoke(newJoke);
            convo.next();
          });
          convo.next();
        });
        convo.next();
    });

    convo.on('end', function(convo){
      bot.reply(message, 'Thanks for teaching me that terrible joke');
    });
  });
});
