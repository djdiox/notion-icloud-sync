import ICloud from "apple-icloud"
const { Client } = require("@notionhq/client")
const dotenv = require("dotenv")

dotenv.config()
const notion = new Client({ auth: process.env.NOTION_KEY })

const databaseId = process.env.NOTION_DATABASE_ID
;(async () => {
  const taskPageIdToStatusMap = await setInitialTaskPageIdToStatusMap()
  console.log("received tasks", taskPageIdToStatusMap)
  const session = {} // An empty session. Has to be a session object or file path that points on a JSON file containing your session

  // This creates your iCloud instance
  const myCloud = new ICloud(
    session,
    process.env.ICLOUD_USERNAME,
    process.env.ICLOUD_PASSWORD
  )

  myCloud.on("ready", function () {
    // This event fires when your session is ready to use. If you used a valid session as argument, it will be fired directly after calling 'new iCloud()' but sometimes your session is invalid and the constructor has to re-login your account. In this case this event will be fired after the time that is needed to login your account.
  })
})()

/**
 * Get and set the initial data store with tasks currently in the database.
 */
async function setInitialTaskPageIdToStatusMap() {
  const currentTasks = await getTasksFromNotionDatabase()
  for (const { pageId, status } of currentTasks) {
    taskPageIdToStatusMap[pageId] = status
  }
  return taskPageIdToStatusMap
}

/**
 * Gets tasks from the database.
 *
 * @returns {Promise<Array<{ pageId: string, status: string, title: string }>>}
 */
async function getTasksFromNotionDatabase() {
  const pages = []
  let cursor

  while (true) {
    const { results, nextCursor } = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
    })
    pages.push(...results)
    if (!nextCursor) {
      break
    }
    cursor = nextCursor
  }
  console.log(`${pages.length} pages successfully fetched.`)
  return pages.map(page => {
    const statusProperty = page.properties.Status
    const status = statusProperty ? statusProperty.select.name : "No Status"
    const title = page.properties.Name.title
      .map(({ plainText }) => plainText)
      .join("")
    return {
      pageId: page.id,
      status,
      title,
    }
  })
}

// /**
//  * Compares task to most recent version of task stored in taskPageIdToStatusMap.
//  * Returns any tasks that have a different status than their last version.
//  *
//  * @param {Array<{ pageId: string, status: string, title: string }>} currentTasks
//  * @returns {Array<{ pageId: string, status: string, title: string }>}
//  */
// function findUpdatedTasks (currentTasks) {
//   return currentTasks.filter(currentTask => {
//     const previousStatus = getPreviousTaskStatus(currentTask)
//     return currentTask.status !== previousStatus
//   })
// }

// /**
//  * Finds or creates task in local data store and returns its status.
//  * @param {{ pageId: string; status: string }} task
//  * @returns {string}
//  */
// function getPreviousTaskStatus ({ pageId, status }) {
//   // If this task hasn't been seen before, add to local pageId to status map.
//   if (!taskPageIdToStatusMap[pageId]) {
//     taskPageIdToStatusMap[pageId] = status
//   }
//   return taskPageIdToStatusMap[pageId]
// }
