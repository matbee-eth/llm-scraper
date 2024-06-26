import { chromium } from 'playwright'
import { z } from 'zod'
import OpenAI from 'openai'
import LLMScraper from './../src'

// Launch a browser instance
const browser = await chromium.launch()

// Initialize LLM provider
const llm = new OpenAI()

// Create a new LLMScraper
const scraper = new LLMScraper(browser, llm)

// Define schema to extract contents into
const schema = z.object({
  title: z.string().describe('Title of the webpage'),
})

// URLs to scrape
const urls = [
  'https://ft.com',
  'https://text.npr.org',
  'https://meduza.io',
  'https://theguardian.com',
]

// Run the scraper
const pages = await scraper.run(urls, {
  model: 'gpt-4-turbo',
  schema,
  mode: 'text',
  closeOnFinish: true,
})

// Stream the result from LLM
for await (const page of pages) {
  console.log(`Page Title: ${page.data?.title}`)
}
