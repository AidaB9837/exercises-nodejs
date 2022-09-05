// class Welcome {
//   constructor() {
//     this.welcomeGreeting = "";
//   }

//   greet() {
//     this.welcomeGreeting = "Hello Jenny! Welcome to the Venus planet!";
//   }
// }

// export const welcomeInstance = new Welcome();

// refactoring: codice più pulito, stesso comportamento!
export const welcomeInstance = {
  welcomeGreeting: "",
  greet(name) {
    this.welcomeGreeting = `Hello ${name}! Welcome to the Venus planet!`;
  },
};
