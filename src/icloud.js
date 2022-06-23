import ICloud from "apple-icloud"
import dotenv from "dotenv"
import readline from "readline"
import { stdin as input, stdout as output } from "node:process"
const rl = readline.createInterface({ input, output })

// An empty session. Has to be a session object or file path that points on a JSON file containing your session
dotenv.config()
export default cli => {
  return new Promise((resolve, reject) => {
    const session = {}
    const myCloud = new ICloud(
      "./session.json",
      process.env.ICLOUD_USERNAME,
      process.env.ICLOUD_PASSWORD
    )

    const result = {
      handler: myCloud,
      session,
      async getReminders(open = true) {
        let tasks = []
        const state = open ? "open" : "completed"
        console.log(`Retrieving ${state} remindaers`)
        if (open) {
          tasks = await myCloud.Reminders.getOpenTasks()
        } else {
          tasks = await myCloud.Reminders.getCompletedTasks()
        }
        console.log("Success", tasks)
        return tasks
      },
    }
    
    rl.question("Please enter a 2FA Code for iCloud: ", twoFactorCode => {
      myCloud.securityCode = twoFactorCode
      myCloud.login(process.env.ICLOUD_USERNAME, process.env.ICLOUD_PASSWORD, (res) => {
        console.log(res);
        myCloud.saveSession()
        resolve(result);
      })
      // myCloud.on("ready", () => {
      //   resolve(result)
      // })
      myCloud.on("error", reject)
      myCloud.on("err", reject)
    })

    return myCloud
  })
}
