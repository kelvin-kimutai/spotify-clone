import { signOut, useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { BiChevronDown } from 'react-icons/bi'
import { shuffle } from 'lodash'
import { playlistIdState, playlistState } from '../atoms/playlistAtom'
import { useRecoilState, useRecoilValue } from 'recoil'
import useSpotify from '../hooks/useSpotify'
import Songs from '../components/songs'

const colors = [
  'from-red-500',
  'from-orange-500',
  'from-yellow-500',
  'from-green-500',
  'from-teal-500',
  'from-blue-500',
  'from-indigo-500',
  'from-purple-500',
  'from-pink-500',
]

function Center() {
  const { data: session } = useSession()
  const spotifyAPi = useSpotify()
  const [color, setcolor] = useState(null)
  const playlistId = useRecoilValue(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState(playlistState)

  useEffect(() => {
    setcolor(shuffle(colors).pop())
  }, [playlistId])

  useEffect(() => {
    spotifyAPi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body)
      })
      .catch((error) => {
        console.log('Something went wrong', error)
      })
  }, [spotifyAPi, playlistId])

  return (
    <div className="h-screen flex-grow overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex cursor-pointer items-center space-x-3 rounded-full bg-black  p-1 pr-2 text-white opacity-90 hover:opacity-80"
          onClick={signOut}
        >
          <img
            className="h-10 w-10 rounded-full"
            src={session?.user.image}
            alt=""
          />
          <h2>{session?.user.name}</h2>
          <BiChevronDown className="h-5 w-5" />
        </div>
      </header>
      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b ${color} to-black p-8 text-white`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt=""
        />
        <div>
          <p>Playlist</p>
          <h1 className="text-2xl font-bold md:text-3xl xl:text-5xl">
            {playlist?.name}
          </h1>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  )
}

export default Center
