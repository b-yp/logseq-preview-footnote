import "@logseq/libs";
import { BlockEntity } from "@logseq/libs/dist/LSPlugin.user";
import { setup as l10nSetup, t } from "logseq-l10n"; //https://github.com/sethyuan/logseq-l10n
import af from "./translations/af.json";
import de from "./translations/de.json";
import es from "./translations/es.json";
import fr from "./translations/fr.json";
import id from "./translations/id.json";
import it from "./translations/it.json";
import ja from "./translations/ja.json";
import ko from "./translations/ko.json";
import nbNO from "./translations/nb-NO.json";
import nl from "./translations/nl.json";
import pl from "./translations/pl.json";
import ptBR from "./translations/pt-BR.json";
import ptPT from "./translations/pt-PT.json";
import ru from "./translations/ru.json";
import sk from "./translations/sk.json";
import tr from "./translations/tr.json";
import uk from "./translations/uk.json";
import zhCN from "./translations/zh-CN.json";
import zhHant from "./translations/zh-Hant.json";
const pluginId = logseq.baseInfo.id;
const key = "preview-footnote-dialog";
const showMsg = "\n\nPreview Footnote ";

let processing = false; // prevent duplicate call

/**
 * Initializes previews for footnotes.
 * @param flag - An optional object containing a `pageLoad` boolean flag to indicate if the page is being loaded.
 */
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

// plugin settings function
/**
 * Defines the plugin settings schema for Preview Footnote plugin.
 * @returns An array of settings objects.
 */
const pluginSettings = () =>
  logseq.useSettingsSchema([
    {
      // add a setting to expand the footnote block
      key: "setFootnotesBlock",
      type: "string",
      title: t('Expand the block that starts with "## Footnotes"'),
      description: t(
        "To show the preview, the block must be expanded. Automatically expand the block."
      ),
      default: "## Footnotes",
    },
    {
      // close the Preview when mouse leave it
      key: "closePreviewMouseLeave",
      type: "boolean",
      title: t("Close the preview when mouse leave it"),
      description: t(
        "If this setting is disabled, the preview will not disappear. You will need to close it manually. This setting has no effect after that 4 seconds."
      ),
      default: false,
    },
    {
      // mouse leave ms delay
      key: "mouseDelay",
      type: "enum",
      title: t("Mouse leave ms delay (The shortest time to disappear)"),
      description: t("Delay before closing preview"),
      default: "2500",
      enumChoices: [
        "1200",
        "1400",
        "1600",
        "1800",
        "2000",
        "2500",
        "3000",
        "3500",
        "4000",
      ],
    },
    {
      // limit the number of previews to one
      key: "limitPreview",
      type: "boolean",
      title: t("Limit the number of previews to one"),
      description: t("False > You can display multiple previews."),
      default: true,
    },
    {
      // close the preview when open other page
      key: "closePreviewWhenOpenPage",
      type: "boolean",
      title: t("Close the preview when open other page"),
      description: t(
        "False > The preview will be retained even if you open another page."
      ),
      default: true,
    },
    {
      // max width of preview
      key: "maxWidth",
      type: "number",
      title: t("Maximum width of preview"),
      description: "200px < 1200px",
      inputAs: "range",
      default: "60",
    },
    {
      // enable YouTube preview optimization
      key: "youtubePreview",
      type: "boolean",
      title: t("Enable YouTube preview optimization"),
      description: "",
      default: true,
    },
  ]);

// observer function
const observer = () => {
  /**
   * Selects the target node in the DOM tree using a CSS selector and returns it as a Node object.
   *
   * @returns The target node as a Node object.
   */
  const targetNode = parent.document.querySelector(
    "body>div#root>div>main>div#app-container"
  ) as Node;
  const observer = new MutationObserver(() => {
    // call init when .fn .footref is added
    const fns = parent.document.body.querySelectorAll(
      'main sup.fn>a.footref:not([data-foot="true"])'
    ) as NodeListOf<Element>;
    if (fns.length === 0) return; // no footnote

    logseq.UI.showMsg(
      t("Checked footnotes") + showMsg + t("plugin"),
      "success",
      {
        timeout: 2200,
      }
    ); // show message
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

  // logseq beforeunload event (plugin off)
  logseq.beforeunload(async () => {
    observer.disconnect();
  });
};

// model function
/**
 * Handles the preview of a footnote when the user hovers over it.
 * @param element - The HTML element of the footnote.
 * @param event - The mouse event that triggered the preview.
 * @returns void
 */
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

  // preview UI
  const maxWidth = logseq.settings!.maxWidth * 10 + 200;
  logseq.provideUI({
    key: UIkey,
    template: `
            <div style="padding: 8px; overflow: auto;" title="">
              <div>
              ${parentNode.outerHTML}
              </div>
            </div>
            ${
              logseq.settings!.youtubePreview === false
                ? ""
                : `
            <style>
              body>div[data-ref="${logseq.baseInfo.id}"]:hover {
                outline: 6px solid var(--ls-quaternary-background-color);
                outline-offset: 6px;
              }
              /* YouTube preview optimization */
              body>div#${logseq.baseInfo.id}--${UIkey} div.is-paragraph:has(>iframe[src*="youtube"]) {
                position: relative;
                min-height: 330px;
                min-width: 588px;
                width:100%;
                height:0;
                padding-top: 56.25%;
                margin-bottom: 1em;
              
                &>iframe[src*="youtube"] {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                }
              }
            </style>
            `
            }
          `,

    style: {
      left: `${event.clientX}px`,
      top: `${event.clientY + 20}px`,
      width: "auto",
      minWidth: "200px",
      maxWidth: `${maxWidth}px`,
      height: "auto",
      padding: ".1em",
      backgroundColor: "var(--ls-primary-background-color)",
      color: "var(--ls-primary-text-color)",
      boxShadow: "1px 2px 5px var(--ls-secondary-background-color)",
    },
    attrs: {
      title: t("Footnote"),
    },
  });

  // close the preview when mouse leave it
  if (logseq.settings!.closePreviewMouseLeave === true)
    closePreviewMouseLeave(UIkey);
};

// close the preview when mouse leave it
/**
 * Closes the preview when the mouse leaves the preview element.
 * @param UIkey - The unique identifier of the preview element.
 */
const closePreviewMouseLeave = (UIkey: string) =>
  setTimeout(() => {
    const ele = parent.document.querySelector(
      `body>div#${logseq.baseInfo.id}--${UIkey}`
    ) as HTMLDivElement | null;
    if (ele === null) return;
    ele.addEventListener("mouseleave", eventListener, { once: true });
    setTimeout(
      () => ele.removeEventListener("mouseleave", eventListener),
      4100
    );
    function eventListener(this: HTMLElement) {
      this.remove();
    }
  }, Number(logseq.settings!.mouseDelay | 10));

// expand the footnote block function
/**
 * Expands the footnote block and returns the corresponding HTML element.
 * @param elementId - The ID of the HTML element to return.
 * @returns The expanded HTML element or null if it cannot be found.
 */
const expandFootnotesBlock = async (
  elementId: string
): Promise<HTMLElement | null> => {
  logseq.UI.showMsg(
    t("Footnote not defined (or collapse)") + showMsg + t("plugin"),
    "warning",
    {
      timeout: 2200,
    }
  ); // show message

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

/**
 * The main function of the plugin.
 * It initializes the plugin settings and sets up the necessary event listeners.
 */
const main = async () => {
  console.info(`#${pluginId}: MAIN`);

  // localization
  await l10nSetup({
    builtinTranslations: {
      //Full translations
      af,
      de,
      es,
      fr,
      id,
      it,
      ja,
      ko,
      "nb-NO": nbNO,
      nl,
      pl,
      "pt-BR": ptBR,
      "pt-PT": ptPT,
      ru,
      sk,
      tr,
      uk,
      "zh-CN": zhCN,
      "zh-Hant": zhHant,
    },
  });

  // init settings
  pluginSettings();

  // init
  logseq.App.onRouteChanged(() => init({ pageLoad: true })); //"onRouteChanged" is sometimes not called
  logseq.App.onPageHeadActionsSlotted(() => init({ pageLoad: true })); // duplicate call, but it's ok.

  // observer for all blocks
  observer();
}; //end main

logseq.ready(main).catch(console.error);
