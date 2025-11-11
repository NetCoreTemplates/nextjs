export function useMDXComponents(components) {
  return {
    // Provide custom components for MDX elements
    table: (props) => (
      <table className="min-w-full divide-y divide-gray-300" {...props} />
    ),
    th: (props) => (
      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900" {...props} />
    ),
    td: (props) => (
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500" {...props} />
    ),
    ...components,
  }
}

