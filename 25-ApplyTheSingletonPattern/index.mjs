import "./script-1.mjs";
import "./script-2.mjs";
import { welcomeInstance } from "./welcome.mjs";

welcomeInstance.greet("Aida");

console.log("by index:", welcomeInstance.welcomeGreeting);
