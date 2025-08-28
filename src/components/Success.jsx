export default function Success({ customMessage }) {
  return (
    <div
      className={`w-fit h-fit p-4 bg-green-200 rounded-md animate-slideIn dark:bg-green-800`}
    >
      <p className="font-inter font-semibold text-green-800 text-base dark:text-green-200">
        {customMessage}
      </p>
    </div>
  )
}
