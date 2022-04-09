import React, { useEffect, useState } from 'react'
import { MdHomeFilled } from 'react-icons/md'
import { BsSearch } from 'react-icons/bs'
import { VscLibrary } from 'react-icons/vsc'
import { BsPlusSquareFill, BsHeartFill } from 'react-icons/bs'
import { HiRss } from 'react-icons/hi'
import { signOut, useSession } from 'next-auth/react'
import useSpotify from '../hooks/useSpotify'
import { playlistIdState } from '../atoms/playlistAtom'
import { useRecoilState } from 'recoil'

function SideBar() {
  const spotifyAPi = useSpotify()

  const { data: session, status } = useSession()
  const [playlists, setPlaylists] = useState([])
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)

  useEffect(() => {
    if (spotifyAPi.getAccessToken()) {
      spotifyAPi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items)
      })
    }
  }, [session, spotifyAPi])

  return (
    <div className="hidden h-screen overflow-y-scroll border-r border-gray-900 p-5  text-xs text-gray-500 scrollbar-hide sm:max-w-[12rem] md:inline-flex lg:max-w-[15rem] lg:text-sm">
      <div className="space-y-4">
        <button className="flex items-center space-x-2 hover:text-white">
          <MdHomeFilled className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <BsSearch className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <VscLibrary className="h-5 w-5" />
          <p>Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />
        <button className="flex items-center space-x-2 hover:text-white">
          <BsPlusSquareFill className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <BsHeartFill className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HiRss className="h-5 w-5" />
          <p>Your Episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />
        {playlists.map((playlist) => (
          <p
            key={playlist.id}
            className="cursor-pointer hover:text-white"
            onClick={() => setPlaylistId(playlist.id)}
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  )
}

export default SideBar
