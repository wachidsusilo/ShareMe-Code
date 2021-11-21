import icC from '../assets/svg/c.svg'
import icCpp from '../assets/svg/cpp.svg'
import icCss from '../assets/svg/css.svg'
import icHtml from '../assets/svg/html.svg'
import icJava from '../assets/svg/java.svg'
import icJavaScript from '../assets/svg/javascript.svg'
import icJson from '../assets/svg/json.svg'
import icKotlin from '../assets/svg/kotlin.svg'
import icMarkDown from '../assets/svg/markdown.svg'
import icPhp from '../assets/svg/php.svg'
import icPlainText from '../assets/svg/text.svg'
import icPython from '../assets/svg/python.svg'
import icRust from '../assets/svg/rust.svg'
import icSql from '../assets/svg/sql.svg'
import icXml from '../assets/svg/xml.svg'
import icTypeScript from '../assets/svg/typescript.svg'

export interface LanguageModel {
    id: string,
    name: string
}

export const availableLanguages: Array<LanguageModel> = [
    { id: 'c', name: 'C' },
    { id: 'cpp', name: 'C++' },
    { id: 'css', name: 'CSS' },
    { id: 'html', name: 'HTML' },
    { id: 'java', name: 'Java' },
    { id: 'js', name: 'JavaScript' },
    { id: 'json', name: 'JSON' },
    { id: 'kt', name: 'Kotlin' },
    { id: 'md', name: 'MarkDown' },
    { id: 'php', name: 'PHP' },
    { id: '', name: 'PlainText' },
    { id: 'py', name: 'Python' },
    { id: 'rs', name: 'Rust' },
    { id: 'sql', name: 'SQL' },
    { id: 'ts', name: 'TypeScript' },
    { id: 'xml', name: 'XML' }
]

export const getLanguageName = (languageId: string) => {
    switch (languageId) {
        case 'ts':
            return 'TypeScript'
        case 'js':
            return 'JavaScript'
        case 'json':
            return 'JSON'
        case 'html':
            return 'HTML'
        case 'c':
            return 'C'
        case 'cpp':
            return 'C++'
        case 'css':
            return 'CSS'
        case 'java':
            return 'Java'
        case 'kt':
            return 'Kotlin'
        case 'md':
            return 'MarkDown'
        case 'php':
            return 'PHP'
        case 'py':
            return 'Python'
        case 'rs':
            return 'Rust'
        case 'sql':
            return 'SQL'
        case 'xml':
            return 'XML'
    }
    return 'PlainText'
}

export const getLanguageColor = (languageId: string) => {
    switch (languageId) {
        case 'ts':
            return '#0288d1'
        case 'js':
            return '#ffca28'
        case 'json':
            return '#fbc02d'
        case 'html':
            return '#e44d26'
        case 'c':
            return '#0277bd'
        case 'cpp':
            return '#0277bd'
        case 'css':
            return '#42a5f5'
        case 'java':
            return '#f44336'
        case 'kt':
            return '#0296d8'
        case 'md':
            return '#42a5f5'
        case 'php':
            return '#0288d1'
        case 'py':
            return '#fdd835'
        case 'rs':
            return '#ff7043'
        case 'sql':
            return '#ffca28'
        case 'xml':
            return '#8bc34a'
    }
    return '#42a5f5'
}

export const getLanguageIcon = (languageId: string) => {
    switch (languageId) {
        case 'ts':
            return icTypeScript
        case 'js':
            return icJavaScript
        case 'json':
            return icJson
        case 'html':
            return icHtml
        case 'c':
            return icC
        case 'cpp':
            return icCpp
        case 'css':
            return icCss
        case 'java':
            return icJava
        case 'kt':
            return icKotlin
        case 'md':
            return icMarkDown
        case 'php':
            return icPhp
        case 'py':
            return icPython
        case 'rs':
            return icRust
        case 'sql':
            return icSql
        case 'xml':
            return icXml
    }
    return icPlainText
}
