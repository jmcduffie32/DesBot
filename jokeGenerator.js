var jsonFile = require('jsonfile'),
    jokeFile = jsonFile.readFileSync('./jokesList.json'),
    jokeArray = jokeFile.jokes;

getJoke = function(){
  index = Math.floor(Math.random() * jokeArray.length);
  return jokeArray[index];
};

createJoke = function(newJoke){
  jokeArray.push(newJoke);
  jsonFile.writeFileSync('./jokesList.json', jokeArray, {spaces: 2});
};

module.exports = {
  getJoke: getJoke,
  createJoke: createJoke
};
