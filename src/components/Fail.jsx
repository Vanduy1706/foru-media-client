export default function Fail({ customMessage }) {
  return (
    <div
      className={`w-fit h-fit p-4 bg-red-200 rounded-md animate-slideIn dark:bg-red-800`}
    >
      <p className="font-inter font-semibold text-red-800 text-base dark:text-red-200">
        {customMessage}
      </p>
    </div>
  )
}
