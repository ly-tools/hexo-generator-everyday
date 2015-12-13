# hexo-generator-everyday

轻松使用hexo写日记

## Install

在hexo项目下使用npm进行安装：
```
$ npm install hexo-generator-everyday
```

## Write
---
在hexo项目根目录下新建一个名为everyday的目录，然后就可以在里面写日记啦。

**目前仅支持markdown格式**

比如写一篇2014年11月7日的日记，就在everyday目录下新建一个2014-11-7.md

## Configuration
---
可以在hexo的`_config.yml`文件下进行如下配置：

```yaml
everyday:
  path: 'everyday' #日记的路径
  enable: true #是否启用日记
  author: '天镶' #你的昵称
  description: '天镶的日记 | Code everyday, keep girls away~' #日记页面的描述
  highlight: #日记中的markdown代码高亮配置，使用highlight.js
    languages: #需要高亮的语言
      - 'javascript'
      - 'css'
      - 'xml'
      - 'markdown'
    style: 'github' #高亮使用的样式
```

## License
MIT
