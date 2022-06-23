import promptiCloud from './prompt-credentials.js'
// import dotenv from "dotenv"

(async () => {
  // Login to icloud and ask for new credentials if needed
  const myCloud = await promptiCloud()

  const collectionsWithOpenTasks = await myCloud.Reminders.getOpenTasks()

  console.log(collectionsWithOpenTasks)
  return collectionsWithOpenTasks
})()
