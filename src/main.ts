import "@logseq/libs";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";

const pluginId = logseq.baseInfo.id;
const key = "preview-footnote-dialog";

let processing = false; // prevent duplicate call

const init = (flag?: { pageLoad?: boolean }) => {
  if (
    flag &&
    flag.pageLoad === true &&
    logseq.settings!.closePreviewWhenOpenPage === true
  ) {
    const ele = parent.document.querySelector(
      `body>div[data-ref="${logseq.baseInfo.id}"]`
    ) as HTMLDivElement | null;
    if (ele) ele.remove();
  }

  if (processing) return; // prevent duplicate call
  const fns = parent.document.body.querySelectorAll(
    'sup.fn>a.footref:not([data-foot="true"])'
  ) as NodeListOf<Element>; //target list of footnotes
  if (fns.length === 0) return; // no footnote
  processing = true; // prevent duplicate call

  for (const fn of fns) {
    const currentId = fn.id.split(".")[1];
    const footNote = parent.document.getElementById(
      `fnr.${currentId}`
    ) as HTMLElement | null;

    // null means the footnote is not defined or collapsed
    if (footNote === null) continue;

    // dataset for preview
    footNote.dataset.footnote = `fn.${currentId}`;
    footNote.dataset.footDef = `fnr.${currentId}`;
    (fn as HTMLElement).dataset.foot = "true"; // flag for editing block

    // add event listener
    const mouseOver = () => {
      footNote.addEventListener(
        "mouseenter",
        function (this: HTMLElement, e: MouseEvent) {
          if (
            (parent.document.querySelector(
              `body>div[data-ref="${logseq.baseInfo.id}"]`
            ) as Node | null) && // if the preview is already open
            logseq.settings!.limitPreview === true
          )
            return;
          // limit the number of previews to one
          else handlePreview(this, e); // show preview
        },
        { once: true }
      );

      footNote.addEventListener(
        "mouseleave",
        () => {
          // Close the preview when mouse leave it
          setTimeout(() => mouseOver(), 2000); // event listener
        },
        { once: true }
      );
    };

    mouseOver(); // first time
  }

  processing = false; // prevent duplicate call
};

function main() {
  console.info(`#${pluginId}: MAIN`);

  // Plugin Settings
  logseq.useSettingsSchema([
    {
      // add a setting to expand the footnote block
      key: "setFootnotesBlock",
      type: "string",
      title: 'Expand the block that starts with "## Footnotes"',
      description:
        "To show the preview, the block must be expanded. Automatically expand the block.",
      default: "## Footnotes",
    },
    {
      // close the Preview when mouse leave it
      key: "closePreviewMouseLeave",
      type: "boolean",
      title: "Close the preview when mouse leave it",
      description:
        "If this setting is disabled, the preview will not disappear. You will need to close it manually. This setting will be disabled after 10 seconds. This setting has no effect after that 8 seconds.",
      default: false,
    },
    {
      // mouse leave ms delay
      key: "mouseDelay",
      type: "enum",
      title: "Mouse out ms delay (The shortest time to disappear)",
      description: "Delay before the preview is displayed.",
      default: "1000",
      enumChoices: [
        "600",
        "800",
        "1000",
        "1200",
        "1400",
        "1600",
        "1800",
        "2000",
        "2500",
        "3000",
      ],
    },
    {
      // limit the number of previews to one
      key: "limitPreview",
      type: "boolean",
      title: "Limit the number of previews to one",
      description: "False > You can display multiple previews.",
      default: true,
    },
    {
      // close the preview when open other page
      key: "closePreviewWhenOpenPage",
      type: "boolean",
      title: "Close the preview when open other page",
      description:
        "False > The preview will be retained even if you open another page.",
      default: true,
    },
  ]);

  logseq.App.onRouteChanged(() => init({ pageLoad: true })); //"onRouteChanged" is sometimes not called
  logseq.App.onPageHeadActionsSlotted(() => init({ pageLoad: true })); // duplicate call, but it's ok.

  const targetNode = parent.document.querySelector(
    "body>div#root>div>main>div#app-container"
  ) as Node;
  const observer = new MutationObserver(() => {
    // call init when .fn .footref is added
    const fns = parent.document.body.querySelectorAll(
      'sup.fn>a.footref:not([data-foot="true"])'
    ) as NodeListOf<Element>;
    if (fns.length === 0) return; // no footnote

    logseq.UI.showMsg("Footnotes check", "success", { timeout: 2200 }); // show message
    init();

    observer.disconnect();
    setTimeout(
      () => observer.observe(targetNode, { childList: true, subtree: true }),
      1000
    );
  });

  // observer for all blocks (for the first time)
  setTimeout(
    () => observer.observe(targetNode, { childList: true, subtree: true }),
    3000
  );

  logseq.beforeunload(async () => {
    observer.disconnect();
  });
} //end main

// model function
const handlePreview = async (element: HTMLElement, event: MouseEvent) => {
  let elementId = element.dataset.footnote;
  if (!elementId) elementId = `fnr.${element.outerText}`;

  let elementFootNote = parent.document.getElementById(
    elementId
  ) as Node | null;
  if (elementFootNote === null) {
    elementFootNote = await expandFootnotesBlock(elementId); // try to expand the footnote block
    if (elementFootNote === null) return; // footnote not defined
  }
  const parentNode = elementFootNote.parentElement as HTMLElement;
  if (parentNode === null) return;

  // random key
  const random =
    Math.random().toString(36).slice(-1) + Math.random().toString(36).slice(-1);
  const UIkey =
    logseq.settings!.limitPreview === true
      ? key
      : random + elementId.replace(/\./g, "-");
  logseq.provideUI({
    key: UIkey,
    template: `
            <div style="padding: 8px; overflow: auto;">
              <div>
              ${parentNode.outerHTML}
              </div>
            </div>
          `,

    style: {
      left: `${event.clientX}px`,
      top: `${event.clientY + 20}px`,
      width: "auto",
      minWidth: "300px",
      maxWidth: "600px",
      padding: ".1em",
      backgroundColor: "var(--ls-primary-background-color)",
      color: "var(--ls-primary-text-color)",
      boxShadow: "1px 2px 5px var(--ls-secondary-background-color)",
    },
    attrs: {
      title: "Footnote",
    },
  });

  if (logseq.settings!.closePreviewMouseLeave === true)
    setTimeout(() => {
      const ele = parent.document.querySelector(
        `body>div#${logseq.baseInfo.id}--${UIkey}`
      ) as HTMLDivElement | null;
      if (ele === null) return;
      ele.addEventListener("mouseleave", eventListener, { once: true });
      setTimeout(
        () => ele.removeEventListener("mouseleave", eventListener),
        8000
      );
      function eventListener(this: HTMLElement) {
        this.remove();
      }
    }, Number(logseq.settings!.mouseDelay | 10));
};

// expand the footnote block function
const expandFootnotesBlock = async (
  elementId: string
): Promise<HTMLElement | null> => {
  logseq.UI.showMsg("Footnote not defined (or collapse)", "warning", {
    timeout: 2200,
  }); // show message

  const currentBlockTree = (await logseq.Editor.getCurrentPageBlocksTree()) as
    | BlockEntity[]
    | null; // get current block
  if (currentBlockTree === null) return null;
  // find the block that starts with "Footnotes"
  const footnotesBlock = currentBlockTree.find((block) =>
    block.content.startsWith("## Footnotes")
  ) as BlockEntity | undefined;
  if (footnotesBlock === undefined) return null;
  const blockId = footnotesBlock.uuid; // get the block id

  logseq.Editor.setBlockCollapsed(blockId, { flag: false }); // expand the blockId

  return parent.document.getElementById(elementId) as HTMLElement | null; // return the footnote element
};

logseq.ready(main).catch(console.error);
