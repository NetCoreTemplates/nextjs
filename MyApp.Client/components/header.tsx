import Link from "next/link"

const Header = () => {
  return (
    <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight mb-20 mt-8 text-gray-900 dark:text-gray-100">
      <Link href="/" className="hover:underline">
          MyApp
      </Link>
      .
    </h2>
  )
}

export default Header
