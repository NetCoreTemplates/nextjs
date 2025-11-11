import Link from "next/link"

type Props = {
    className?: string
    name: string
    href?: string
    current?: boolean
}

export default function Breadcrumbs({ className, name, href, current } : Props) {
    if (current == null) {
        current = true;
    }
    let crumb = href
        ? (<Link href={href} className="ml-1 sm:ml-4 text-2xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" aria-current={current ? 'page' : undefined}>
            {name}
           </Link>)
        : (<span className="ml-1 sm:ml-4 text-3xl text-gray-700 dark:text-gray-200" aria-current={current ? 'page' : undefined}>
            {name}</span>);

  return (
    <nav className={["flex", className].join(' ')} aria-label="Breadcrumb">
      <ol role="list" className="flex items-center sm:space-x-4">
        <li>
          <div>
            <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <svg className="flex-shrink-0 h-8 w-8" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
                <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        <li>
            <div className="flex items-center">
                <svg className="flex-shrink-0 h-8 w-8 text-gray-400 dark:text-gray-500" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
                {crumb}
            </div>
          </li>
      </ol>
    </nav>
  )
}
