import "@logseq/libs";

import { logseq as PL } from "../package.json";

const pluginId = PL.id;
const key = 'preview-footnote-dialog'

const init = () => {
  const fns = top!.document.querySelectorAll('.fn .footref')
  const _top = top
  const list: { fn: Element, footdef: HTMLElement | null }[] = []

  fns.forEach(fn => {
    const currentId = fn.id.split('.')[1]
    // TODO: 这里为什么用 querySelector 获取不到元素我不知道
    const footdef = _top!.document.getElementById(`fn.${currentId}`)
    list.push({ fn, footdef })
  })

  console.log('list', list)

  list.forEach(i => {
    const handlePreview = (e: any) => {
      const parentNode = i?.footdef?.parentNode
      logseq.provideUI({
        key,
        close: 'outside',
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

    i.fn.addEventListener('mouseenter', handlePreview)
    i.fn.addEventListener('mouseleave', () => {
      const dialog = _top!.document.getElementById(`${pluginId}--${key}`)
      dialog?.remove()
    })
  })
}

function main() {
  console.info(`#${pluginId}: MAIN`);

  logseq.App.onRouteChanged(init)
}

logseq.ready(main).catch(console.error);
