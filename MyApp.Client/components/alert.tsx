import Container from "./container"
import { classNames } from "@servicestack/client"
import { EXAMPLE_PATH } from "@/lib/constants"

type Props = {
  preview?: boolean
}

const Alert = ({ preview }: Props) => {
  return (
    <div
      className={classNames('border-b', {
        'bg-accent-7 dark:bg-gray-800 border-accent-7 dark:border-gray-700 text-white': preview,
        'bg-accent-1 dark:bg-gray-800 border-accent-2 dark:border-gray-700': !preview,
      })}
    >
      <Container>
        <div className="py-2 text-center text-sm text-gray-900 dark:text-gray-100">
          {preview ? (
            <>
              This page is a preview.{' '}
              <a
                href="/api/exit-preview"
                className="underline hover:text-cyan duration-200 transition-colors"
              >
                Click here
              </a>{' '}
              to exit preview mode.
            </>
          ) : (
            <>
              The source code for this blog is{' '}
              <a
                href={`https://github.com/vercel/next.js/tree/canary/examples/${EXAMPLE_PATH}`}
                className="underline hover:text-success duration-200 transition-colors"
              >
                available on GitHub
              </a>
              .
            </>
          )}
        </div>
      </Container>
    </div>
  )
}

export default Alert
