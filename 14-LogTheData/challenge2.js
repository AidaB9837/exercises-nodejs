// Challenge 2:
//
// Use 2 different techniques to output a formatted version
// of this complete object.

const familyTree = [
  {
    name: "Person 1",
    children: [
      {
        name: "Person 2",
        children: [
          {
            name: "Person 3",
            children: [
              {
                name: "Person 4",
              },
            ],
          },
        ],
      },
    ],
  },
];

console.log("First:", JSON.stringify(familyTree, null, 2));

console.log("Second:", JSON.stringify(familyTree));

//Another one
// console.dir(familyTree, { depth: null });
