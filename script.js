const chalk = require("chalk");
const shell = require("shelljs");

const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const server = async () => {
  const goServerInside = `cd prisma-server-and-migrate &&`;
  console.log("Starting script");
  let cmd = ``;
  console.log("Wait for mysql to start for 5 min ...");
  // await delay(1000 * 60 * 5);

  cmd = shell.exec(`node --version`);
  console.log(chalk.green("node --version"));

  cmd = shell.exec(`npm config set registry http://registry.npmjs.org`);
  console.log(chalk.green("npm config set registry http://registry.npmjs.org"));

  cmd = shell.exec(`${goServerInside} npm i`);
  console.log(chalk.green("npm i"));

  cmd = shell.exec(`${goServerInside} npx prisma init --datasource-provider`);
  console.log(chalk.green("npx prisma init"));

  cmd = shell.exec(
    `${goServerInside} npx prisma migrate dev --name myagizmaktav`
  );
  console.log(chalk.green("npx prisma migrate dev --name myagizmaktav"));

  cmd = shell.exec(`${goServerInside} npx prisma db push`);
  console.log(chalk.green("npx prisma db push"));

  cmd = shell.exec(`${goServerInside} npx prisma generate`);
  console.log(chalk.green("npx prisma generate"));

  cmd = shell.exec(`${goServerInside} npx ts-node seed.ts`);
  console.log(chalk.green("npx ts-node seed.ts"));

  cmd = shell.exec(`${goServerInside} npm run dev`);
  return cmd;
};
server();
