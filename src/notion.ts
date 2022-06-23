import { Client } from "@notionhq/client"
import dotenv from "dotenv"
export default class NotionHandler {
  notion: Client
  constructor() {
    dotenv.config()
    this.notion = new Client({ auth: process.env.NOTION_KEY })
  }
  async getTasks() {
    console.log('Getting tasks')
    const response = await this.notion.search({
      query: "task",
      sort: {
        direction: "ascending",
        timestamp: "last_edited_time",
      },
    })
  }
}
