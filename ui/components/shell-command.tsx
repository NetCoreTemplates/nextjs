import { Icon } from "@iconify/react"
import { FC, MouseEvent, useState } from "react"

const ShellCommand: FC<any> = ({ className, children }) => {
    
    let [successText, setSuccessText] = useState("")

    function copy(e: MouseEvent) {
        let $el = document.createElement("input")
        let $lbl = (e.target as HTMLElement).parentElement!.querySelector('label')!

        $el.setAttribute("value", $lbl.innerText)
        document.body.appendChild($el)
        $el.select()
        document.execCommand("copy")
        document.body.removeChild($el);

        if (typeof window.getSelection == "function") {
            const range = document.createRange()
            range.selectNodeContents($lbl)
            window.getSelection()?.removeAllRanges()
            window.getSelection()?.addRange(range)
        }

        setSuccessText('copied')
        setTimeout(() => setSuccessText(''), 3000)
    }
    
    return (
        <div className={`${className} lang relative bg-gray-700 text-gray-300 pl-5 py-3 sm:rounded flex`}>
            <div className="flex ml-2 w-full justify-between cursor-pointer" onClick={copy}>
                <span>$ <label className="">{children}</label></span>
                <small className="text-xs text-gray-400 px-3 -mt-1">sh</small>
            </div>
            {!successText ? null : <div className="-mr-24 right-0 absolute text-md text-gray-200 bg-green-700 px-1 rounded">
                <div className="flex pr-1">
                    <Icon icon="mdi:check" className="w-5 h-5 mt-0.5"/>
                    {successText}
                </div>
            </div>}
        </div>)
}

export default ShellCommand
