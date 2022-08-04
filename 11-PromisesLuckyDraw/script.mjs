function luckyDraw(player) {
  return new Promise((resolve, reject) => {
    const win = Boolean(Math.round(Math.random()));

    process.nextTick(() => {
      if (win) {
        resolve(`${player} won a prize in the draw!`);
      } else {
        reject(new Error(`${player} lost the draw.`));
      }
    });
  });
}

luckyDraw("Joe")
  .then((output) => console.log(output))
  .then(() => luckyDraw("Caroline"))
  .then((output) => console.log(output))
  .then(() => luckyDraw("Sabrina"))
  .then((output) => console.log(output))
  .catch((error) => console.error(error));
