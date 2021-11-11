import { ChevronRightIcon, HomeIcon } from '@heroicons/react/solid'
import Link from 'next/link'

type Props = {
    className?: string,
    name: string,
    href?: string,
    current?: boolean
}

export default function Breadcrumbs({ className, name, href, current } : Props) {
    if (current == null) {
        current = true;
    }
    let crumb = href 
        ? (<Link href={href}>
            <a className="ml-4 text-2xl text-gray-500 hover:text-gray-700" aria-current={current ? 'page' : undefined}>
                {name}
            </a>
        </Link>)
        : (<span className="ml-4 text-3xl text-gray-700" aria-current={current ? 'page' : undefined}>
            {name}</span>);

  return (
    <nav className={["flex", className].join(' ')} aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <Link href="/">
              <a className="text-gray-600 hover:text-gray-700">
                <HomeIcon className="flex-shrink-0 h-8 w-8" aria-hidden="true" />
                <span className="sr-only">Home</span>
              </a>
            </Link>
          </div>
        </li>
        <li>
            <div className="flex items-center">
              <ChevronRightIcon className="flex-shrink-0 h-8 w-8 text-gray-400" aria-hidden="true" />
              {crumb}
            </div>
          </li>
      </ol>
    </nav>
  )
}
