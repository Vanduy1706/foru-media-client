export default function Info({ customMessage }) {
  return (
    <div
      className={`w-fit h-fit p-4 bg-blue-200 rounded-md animate-slideIn dark:bg-blue-800`}
    >
      <p className="font-inter font-semibold text-blue-800 text-base dark:text-blue-200">
        {customMessage}
      </p>
    </div>
  )
}
