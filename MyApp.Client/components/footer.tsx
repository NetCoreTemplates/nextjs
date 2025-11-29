import Container from "./container"
import FeatureLinks from "./feature-links"

const Footer = () => {
  return (
    <footer className="bg-accent-1 dark:bg-gray-800 border-t border-accent-2 dark:border-gray-700">
             
    <FeatureLinks />

     <Container>
        <div className="py-28 flex flex-col lg:flex-row items-center">
          <h3 className="text-4xl lg:text-6xl font-bold tracking-tighter leading-tight text-center lg:text-left mb-10 lg:mb-0 lg:pr-4 lg:w-1/2 text-gray-900 dark:text-gray-100">
            A ServiceStack Project
          </h3>
          <div className="flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2">
            <a
              href="https://docs.servicestack.net"
              className="mx-3 bg-black dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 hover:text-black dark:hover:text-white border border-black dark:border-gray-600 text-white font-bold py-3 px-12 lg:px-8 duration-200 transition-colors mb-6 lg:mb-0"
            >
              Read Documentation
            </a>
            <a
              href={`https://github.com/NetCoreTemplates/nextjs`}
              className="mx-3 font-bold hover:underline text-gray-900 dark:text-gray-100"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
