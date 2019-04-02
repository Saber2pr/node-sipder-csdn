import { Http } from './http'
import cheerio from 'cheerio'
import { File } from 'saber-node'

export type Item = {
  name: string
  href: string
  content: string
}

export type Items = Item[]

async function work(href: string): Promise<Item> {
  const res = await Http.get(href)
  const $ = cheerio.load(res)
  const name = $('.title-article')
    .text()
    .trim()
  const container = $('.baidu_pl')
  const paras = container
    .find('p')
    .text()
    .trim()
  let codes: string[] = []
  container.find('code').map((i, element) => {
    codes.push('```ts\n'.concat(cheerio(element).text()).concat('\n```'))
  })
  const content = paras.concat(codes.join('\n'))
  return { name, content, href: '/blog/' + href.split('/').pop() }
}

export async function download(hrefs: string[]) {
  const items: Items = []
  for (let h of hrefs) {
    items.push(await work(h))
  }
  await File.createFile(
    `${process.cwd()}/output/data.json`,
    JSON.stringify(items, null, 2)
  )
}
