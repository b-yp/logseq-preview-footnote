import "@logseq/libs"
import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user"
import { on } from "events"

const pluginId = logseq.baseInfo.id
const key = 'preview-footnote-dialog'

let processing:boolean = false // prevent duplicate call

const init = () => {
  if (processing) return // prevent duplicate call
  processing = true // prevent duplicate call
  let once:boolean = false
  const fns = parent.document.querySelectorAll('.fn .footref') as NodeListOf<Element> //target list of footnotes

  const list: { fn: Element, footdef: HTMLElement | null }[] = []

  for(const fn of fns) {
    const currentId = fn.id.split('.')[1]
    // TODO: 这里为什么用 querySelector 获取不到元素我不知道
    let footdef = parent.document.getElementById(`fn.${currentId}`) as HTMLElement | null

    // null means the footnote is not defined or collapsed
    if (footdef === null) {
      expandFootnotesBlock()  // try to expand the footnote block
      once = true
      return // get the footnote again
    }
    list.push({ fn, footdef })
  }
  if (once) return // get the footnote again

  console.log('list', list)

  list.forEach(i => {
    const handlePreview = (e: any) => {
      const parentNode = i?.footdef?.parentNode
      logseq.provideUI({
        key,
        template: `
          <div style="padding: 10px; overflow: auto;">
            <div>
            ${(parentNode as Element)?.outerHTML}
            </div>
          </div>
        `,
        style: {
          left: `${e.clientX}px`,
          top: `${e.clientY + 20}px`,
          width: 'auto',
          minWidth: '300px',
          maxWidth: '600px',
          backgroundColor: 'var(--ls-primary-background-color)',
          color: 'var(--ls-primary-text-color)',
          boxShadow: '1px 2px 5px var(--ls-secondary-background-color)',
        },
        attrs: {
          title: 'Footnote content',
        }
      })
    }

    const mouseOver = ()=> {
      i.fn.addEventListener('mouseenter', handlePreview, { once: true })
      i.fn.addEventListener('mouseleave', () => {
        mouseOver()
    }, { once: true })
    }
    mouseOver() // first time

  })
  processing = false // prevent duplicate call
}

function main() {
  console.info(`#${pluginId}: MAIN`)

  // Plugin Settings
  logseq.useSettingsSchema([
    {// add a setting to expand the footnote block
      key: 'setFootnotesBlock',
      type: 'string',
      title: 'Expand the block that starts with "## Footnotes"',
      description: 'To show the preview, the block must be expanded. Automatically expand the block.',
      default: "## Footnotes",
    },
  ])

  logseq.App.onRouteChanged(init) //"onRouteChanged" is sometimes not called
  logseq.App.onPageHeadActionsSlotted(init) // duplicate call, but it's ok.
}

logseq.ready(main).catch(console.error)



const expandFootnotesBlock = async () => {

  logseq.UI.showMsg('Footnote not defined (or collapse)', "warning",{timeout: 2200}) // show message
  const currentBlockTree = await logseq.Editor.getCurrentPageBlocksTree() as BlockEntity[] | null // get current block
  if (currentBlockTree === null) return null
  // find the block that starts with "Footnotes"
  const footnotesBlock = currentBlockTree.find(block => block.content.startsWith("## Footnotes")) as BlockEntity | undefined
  if (footnotesBlock === undefined) return null
  const blockId = footnotesBlock.uuid // get the block id

  logseq.Editor.setBlockCollapsed(blockId, {flag:false}) // expand the block

  // wait for the block to be expanded
  setTimeout(() => init(), 300); // try to get the footnote again

}