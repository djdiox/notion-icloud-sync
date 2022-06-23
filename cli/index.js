import cli from "cli"
import iCloudGenerator from "../src/icloud.js"
;(async () => {
  cli.parse(null, [
    "get-open-reminders",
    "test",
    "edit",
    "remove",
    "uninstall",
    "ls",
  ])
  let iCloudHandler
  let tasks = []
  switch (cli.command) {
    case "get-open-reminders":
      iCloudHandler = await iCloudGenerator(cli)
      console.log('Getting open reminders', iCloudHandler.handler.twoFactorAuthenticationIsRequired)
      // if (iCloudHandler.handler.twoFactorAuthenticationIsRequired) {
      // console.log('Enter Please 2FA')
      // }
      tasks = await iCloudHandler.handler.Reminders.getOpenTasks()
      break
    default:
      break
  }
  console.log('Received Reminders', tasks);
})()
