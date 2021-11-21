
export const testTsx = `import { LegacyRef, MutableRefObject, useEffect, useRef } from 'react'
import './Editor.scss'
import { Compartment, EditorState, Extension } from '@codemirror/state'
import { autocompletion, completeAnyWord, CompletionResult, CompletionSource } from '@codemirror/autocomplete'
import { EditorView } from '@codemirror/view'
import { cpp } from '@codemirror/lang-cpp'
import { css, cssCompletionSource } from '@codemirror/lang-css'
import { html, htmlCompletionSource } from '@codemirror/lang-html'
import { java } from '@codemirror/lang-java'
import { javascript, snippets } from '@codemirror/lang-javascript'
import { json } from '@codemirror/lang-json'
import { markdown } from '@codemirror/lang-markdown'
import { php } from '@codemirror/lang-php'
import { python } from '@codemirror/lang-python'
import { rust } from '@codemirror/lang-rust'
import { sql } from '@codemirror/lang-sql'
import { xml } from '@codemirror/lang-xml'
import { oneDark } from './EditorTheme'
import { setup } from './EditorSetup'
import { indentUnit } from '@codemirror/language'

interface EditorProps {
    text?: string,
    onTextChanged?: (text: string) => void,
    actionRef?: MutableRefObject<{
        updateLanguage: (lang: string) => void
    }>
}

function Editor({ text = '', onTextChanged, actionRef }: EditorProps) {
    const editorRef: LegacyRef<HTMLDivElement> = useRef(null)
    const timeoutRef: MutableRefObject<NodeJS.Timeout | null> = useRef(null)

    useEffect(() => {
        const editor = editorRef.current

        if (editor) {
            let lastDigitCount = 0
            const onChange = EditorView.updateListener.of((v) => {
                if (v.docChanged && onTextChanged) {
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current)
                    }

                    const digitCount = v.state.doc.lines.toString().length
                    if (lastDigitCount !== digitCount) {
                        lastDigitCount = digitCount;
                        const content = document.getElementsByClassName('cm-content')[0] as HTMLDivElement
                        const lines = document.getElementsByClassName('cm-lineNumbers')[0] as HTMLDivElement
                        const lineStyle = window.getComputedStyle(lines)
                        content.style.left = (29 + parseFloat(lineStyle.width)) + 'px'
                        if (content.style.left.length > 0) {
                            content.style.width = \`calc(100% - \${content.style.left})\`
                        }
                    }

                    timeoutRef.current = setTimeout(() => {
                        timeoutRef.current = null
                        onTextChanged(v.state.doc.toJSON().join('\n'))
                    }, 1000)
                }
            })

            const completionCompartment = new Compartment()
            const languageCompartment = new Compartment()

            const view = new EditorView({
                state: EditorState.create({
                    extensions: [
                        setup,
                        oneDark,
                        onChange,
                        indentUnit.of("    "),
                        languageCompartment.of([]),
                        completionCompartment.of(autocompletion({ override: [context => completeAnyWord(context)] }))
                    ]
                }), parent: editor
            })
            
            if (actionRef) {
                actionRef.current = {
                    updateLanguage: (lang: string) => {
                        let newLanguage: Extension = []
                        const newCompletionSources: Array<CompletionSource> = [context => completeAnyWord(context)]
                        switch (lang) {
                            case 'ts':
                                newLanguage = javascript({ jsx: true, typescript: true })
                                newCompletionSources.push(context => {
                                    const result: CompletionResult = {
                                        from: context.state.wordAt(context.pos)?.from ?? context.pos,
                                        options: snippets
                                    }
                                    return result
                                })
                                break;
                            case 'js':
                                newLanguage = javascript({ jsx: true })
                                newCompletionSources.push(context => {
                                    const result: CompletionResult = {
                                        from: context.state.wordAt(context.pos)?.from ?? context.pos,
                                        options: snippets
                                    }
                                    return result
                                })
                                break
                            case 'json':
                                newLanguage = json()
                                break
                            case 'html':
                                newLanguage = html({ matchClosingTags: true, autoCloseTags: true })
                                newCompletionSources.push(htmlCompletionSource)
                                break
                            case 'c':
                            case 'cpp':
                                newLanguage = cpp()
                                break
                            case 'css':
                                newLanguage = css()
                                newCompletionSources.push(cssCompletionSource)
                                break
                            case 'java':
                            case 'kt':
                                newLanguage = java()
                                break
                            case 'md':
                                newLanguage = markdown()
                                break
                            case 'php':
                                newLanguage = php()
                                break
                            case 'py':
                                newLanguage = python()
                                break
                            case 'rs':
                                newLanguage = rust()
                                break
                            case 'sql':
                                newLanguage = sql()
                                break
                            case 'xml':
                                newLanguage = xml()
                                break
                        }

                        view.dispatch({
                            effects: [
                                languageCompartment.reconfigure(newLanguage),
                                completionCompartment.reconfigure(autocompletion({ override: newCompletionSources }))
                            ]
                        })
                    }
                }
            }

            view.dispatch({
                changes: {from: 0, insert: text}
            })

            return (() => {
                view.destroy();
            })
        }

    }, [text, onTextChanged, actionRef])

    return (
        <div ref={editorRef} className='editor'></div>
    )
}

export default Editor
`

export const scssTest = `@import "../../assets/colors/color";

.navigation {
    width: 300px;
    height: 100%;
    position: fixed;
    background-color: $backgroundDark;

    &-title {
        width: 100%;
        height: 60px;
        padding: 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: $primaryColor;

        &-label {
            color: $primaryText;
            font-weight: 500;
            font-size: 20px;
        }

        &-icon {
            fill: $primaryText;
        }
    }

    &-histories {
        width: 100%;
        height: calc(100% - 60px);
        display: flex;
        flex-direction: column;

        &-item {
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            box-shadow: 0 1px 0 0 $backgroundLight;
            cursor: pointer;

            &:hover {
                background-color: $backgroundLight;
            }

            &-icon {
                margin-left: 16px;
                fill: $primaryText;
                width: 35px;
                height: 35px;
            }

            &-container {
                width: 100%;
                height: 100%;
                padding: 0 16px;
                display: flex;
                flex-direction: column;
                justify-content: center;

                &-title {
                    color: $primaryText;
                    font-weight: 500;
                    font-size: 15px;
                    margin-bottom: 4px;
                }

                &-timestamp {
                    color: $primaryText;
                    font-size: 13px;
                }
            }
        }
    }

    &-active {
        background-color: rgba($primaryColor, 0.2) !important;
    }
}
`