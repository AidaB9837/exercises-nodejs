import * as fs from "node:fs";

const data = "These are the contents of file test.txt";
fs.writeFile("text.txt", data, { encoding: "utf-8" }, (error) => {
  if (error) {
    console.error(error);
  }

  console.log(data);
});
