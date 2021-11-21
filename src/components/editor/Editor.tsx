import { LegacyRef, MutableRefObject, useEffect, useRef } from 'react'
import './Editor.scss'
import { Compartment, EditorState, Extension, StateEffect, StateField } from '@codemirror/state'
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
import EditorAction from '../../model/editor'

interface EditorProps {
    doc?: string,
    actionRef?: MutableRefObject<EditorAction>,
    onDocChanged?: (doc: string) => void,
    onFocus?: () => void
}

const languageEffect = StateEffect.define<string>()
export const languageField = StateField.define<string>({
    create: () => '',
    update: (value, tr) => {
        for (let e of tr.effects) if (e.is(languageEffect)) value = e.value
        return value
    }
})

function Editor({ doc = '', actionRef, onDocChanged, onFocus }: EditorProps) {
    const editorRef: LegacyRef<HTMLDivElement> = useRef(null)
    const timeoutRef: MutableRefObject<NodeJS.Timeout | null> = useRef(null)
    const languageRef: MutableRefObject<string> = useRef('')
    const notifyRef: MutableRefObject<boolean> = useRef(true)

    useEffect(() => {
        const editor = editorRef.current

        if (editor) {

            let lastDigitCount = 0
            const onChange = EditorView.updateListener.of((v) => {
                if (v.docChanged && onDocChanged) {
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
                            content.style.width = `calc(100% - ${content.style.left})`
                        }
                    }

                    if(notifyRef.current) {
                        timeoutRef.current = setTimeout(() => {
                            timeoutRef.current = null
                            onDocChanged(v.state.doc.toJSON().join('\n'))
                        }, 1000)
                    } else {
                        notifyRef.current = true
                    }
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
                        completionCompartment.of(autocompletion({ override: [context => completeAnyWord(context)] })),
                        languageField
                    ]
                }), parent: editor
            })

            if (actionRef) {
                actionRef.current.updateLanguage = (lang: string, forceUpdate: boolean = false) => {
                    if (languageRef.current === lang && !forceUpdate) return
                    languageRef.current = lang
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
                            completionCompartment.reconfigure(autocompletion({ override: newCompletionSources })),
                            languageEffect.of(lang)
                        ]
                    })
                }

                actionRef.current.updateDoc = (doc: string, notify: boolean = true) => {
                    notifyRef.current = notify
                    view.dispatch({
                        changes: { from: 0, to: view.state.doc.length, insert: doc }
                    })
                }

                actionRef.current.reset = () => {
                    view.setState(EditorState.create({
                        extensions: [
                            setup,
                            oneDark,
                            onChange,
                            indentUnit.of("    "),
                            languageCompartment.of([]),
                            completionCompartment.of(autocompletion({ override: [context => completeAnyWord(context)] })),
                            languageField
                        ]
                    }))
                }
            }

            view.dispatch({
                changes: { from: 0, insert: doc }
            })

            view.contentDOM.addEventListener('focus', () => {
                if(onFocus) onFocus()
            })

            return (() => {
                view.destroy();
            })
        }

    }, [doc, onDocChanged, actionRef, onFocus])

    return (
        <div ref={editorRef} className='editor'></div>
    )
}

export default Editor
