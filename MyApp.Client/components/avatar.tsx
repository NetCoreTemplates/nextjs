type Props = {
  name: string
  picture: string
}

const Avatar = ({ name, picture }: Props) => {
  return (
    <div className="flex items-center">
      <img src={picture} className="w-12 h-12 rounded-full mr-4" alt={name} />
      <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{name}</div>
    </div>
  )
}

export default Avatar
