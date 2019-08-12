module.exports.names = [
  'Alice',
  'Ben',
  'Charlie',
  'Dan',
  'Edward',
  'Fin',
  'Gomez',
  'Hazel',
  'Iris',
  'John',
];

module.exports.getRandomName = names => {
  return names
    .map(name => ({
      name,
      weight: Math.random(),
    }))
    .sort((a, b) => a.weight - b.weight)
    .map(nameObj => nameObj.name);
};
