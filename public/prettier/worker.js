
importScripts('prettier.js')
importScripts('parser/babel.js')
importScripts('parser/html.js')
importScripts('parser/postcss.js')
importScripts('parser/markdown.js')

onmessage = (event) => {
    if (event.data.doc && event.data.language) {
        switch (event.data.language) {
            case 'ts':
                postMessage(prettier.format(event.data.doc, {
                    parser: 'babel-ts',
                    plugins: prettierPlugins,
                    tabWidth: 4,
                    printWidth: 100
                }))
                break
            case 'js':
                postMessage(prettier.format(event.data.doc, {
                    parser: 'babel',
                    plugins: prettierPlugins,
                    tabWidth: 4,
                    printWidth: 100
                }))
                break
            case 'html':
                postMessage(prettier.format(event.data.doc, {
                    parser: 'html',
                    plugins: prettierPlugins,
                    tabWidth: 4,
                    printWidth: 100
                }))
                break
            case 'css':
                postMessage(prettier.format(event.data.doc, {
                    parser: 'scss',
                    plugins: prettierPlugins,
                    tabWidth: 4,
                    printWidth: 100
                }))
                break
            case 'md':
                postMessage(prettier.format(event.data.doc, {
                    parser: 'markdown',
                    plugins: prettierPlugins,
                    tabWidth: 4,
                    printWidth: 100
                }))
                break
            default:
                postMessage(null)
                break;
        }
    }
}

