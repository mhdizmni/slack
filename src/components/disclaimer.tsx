import Link from "next/link"

export const Disclaimer = () => {
    return (
        <>
        <div className="bg-yellow-500 w-full text-xs text-center">
            This demo is not affiliated with Slack or Salesforce in any ways.
        </div>
        <div className="bg-sky-500 w-full text-xs text-center p-1">
            This is a demo project by <Link href="https://www.linkedin.com/in/mhdizmni/" className="font-bold underline">Mahdi Zamani</Link>. The source code is available on GitHub at <Link href="https://github.com/mhdizmni/slack" className="font-bold font-mono hover:underline">https://github.com/mhdizmni/slack</Link>
        </div>
        </>
    )
}