# logseq-preview-footnote 插件

[English](https://github.com/b-yp/logseq-preview-footnote) | [中文](https://github.com/b-yp/logseq-preview-footnote/blob/main/README.chCN.md) | [日本語](https://github.com/b-yp/logseq-preview-footnote/blob/main/README.ja.md)

提供脚注的预览功能。

## 概述

* 当光标悬停在内容中的脚注上时，它会预览标题块中的内容。
* 复制和显示应该显示在另一个块中的内容。

## 依赖

* Logseq插件 > [logseq-footnotes-plugin](https://github.com/gremi-jr/logseq-footnote-plugin)（来自Logseq Marketplace）
   - 提供一个斜杠命令（"`/添加脚注`"）用于创建脚注。在当前光标位置运行并在脚注块中创建一个标题。

## 用法

  1. 安装`预览脚注`插件（来自Logseq Marketplace）
  1. 在某个块中创建一个脚注。
  1. 将鼠标悬停在脚注上以查看预览

## 演示

- 从创建脚注到显示预览

   ![图像](https://github.com/b-yp/logseq-preview-footnote/raw/main/demo/footnote.gif)

<details>
  <summary>.mp4 视频</summary>
  <video src="https://github.com/b-yp/logseq-preview-footnote/raw/main/demo/Kapture%202023-10-22%20at%2017.47.59.mp4" controls />
</details>

## 插件设置

- 展开以"## 脚注"开头的块
  - 要显示预览，必须展开该块。自动展开块。
  - `true` 默认
  - `false`

- 当鼠标离开时关闭预览
  - 如果禁用此设置，预览将不会消失。您需要手动关闭它。此设置在4秒后不起作用。
  - `false` 默认
  - `true`

- 鼠标离开毫秒延迟（消失的最短时间）
  - 在关闭预览之前的延迟。
  - `600`
  - `800`
  - `1000`
  - `1200` 默认
  - `1400`
  - `1600`
  - `1800`
  - `2000`
  - `2500`

- 限制预览数量为一个
  - `false` > 您可以显示多个预览。
  - `true` 默认
  - `false`

- 在打开另一页时关闭预览
  - `false` > 即使打开另一页，预览也将保留。
  - `true` 默认
  - `false`

- 预览的最大宽度
  - 200px < 1200px
  - `600` 默认

- 启用YouTube预览优化
  - `true` 默认

## 信息

许可证 > [MIT](https://choosealicense.com/licenses/mit/)

作者 > [@b-yp](https://github.com/b-yp)
