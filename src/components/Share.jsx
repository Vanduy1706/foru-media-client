import Card from "./Card"

export default function Share({ forum }) {
  return (
    <>
      <div className="flex flex-row gap-1 px-4 pt-2 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="15"
          viewBox="0 0 24 19"
          fill="none"
        >
          <path
            d="M21.5773 16.418C21.5773 17.4255 20.7606 18.2422 19.7531 18.2422H3.33512V16.418H19.7531V7.29688H21.5773V16.418ZM6.21305 11.4014C6.61502 11.4015 6.81993 11.8841 6.54117 12.1738L3.66324 15.1641C3.48383 15.3505 3.18543 15.3505 3.00602 15.1641L0.128087 12.1738C-0.150436 11.8841 0.0551938 11.4014 0.457189 11.4014H6.21305ZM20.6652 1.82422H4.24723V10.9453H2.42301V1.82422C2.42301 0.81673 3.23973 3.21982e-06 4.24723 0H20.6652V1.82422ZM20.3371 3.07812C20.5165 2.89174 20.8149 2.8917 20.9943 3.07812L23.8713 6.06836C24.15 6.35809 23.9452 6.84081 23.5431 6.84082H17.7873C17.3853 6.84068 17.1804 6.35805 17.4591 6.06836L20.3371 3.07812Z"
            fill="#ff0032"
          />
        </svg>
        <p className="font-inter font-semibold text-gray-500 italic">
          {forum.author.username.length >= 20
            ? `${forum.author.username.slice(0, 20)}...`
            : forum.author.username}{" "}
          republished
        </p>
      </div>
      <Card
        speechId={forum.targetId}
        // toggleHandler={toggleHandler}
        // toggle={toggle}
      />
    </>
  )
}
