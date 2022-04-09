import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import useSpotify from '../hooks/useSpotify'
import useSongInfo from '../hooks/useSongInfo'
import { HiOutlineSwitchHorizontal, HiPause, HiPlay } from 'react-icons/hi'
import { FiVolume1 } from 'react-icons/fi'

import { AiFillStepForward, AiFillStepBackward } from 'react-icons/ai'
import { ImLoop } from 'react-icons/im'
import { debounce } from 'lodash'

function Player() {
  const spotifyApi = useSpotify()
  const { data: session, status } = useSession()
  const [currentTrackId, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volume, setVolume] = useState(50)

  const songInfo = useSongInfo()

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentIdTrack(data.body?.item?.id)
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          setIsPlaying(data.body?.is_playing)
        })
      })
    }
  }

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause()
        setIsPlaying(false)
      } else {
        spotifyApi.play()
        setIsPlaying(true)
      }
    })
  }

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong()
      setVolume(50)
    }
  }, [currentTrackIdState, spotifyApi, session])

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume)
    }
  }, [volume])

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => spotifyApi.setVolume(volume), 500),
    []
  )

  return (
    <div className="tetx-xs grid h-24 grid-cols-3 bg-gradient-to-b from-black to-gray-900 px-2 text-white md:px-8 md:text-base">
      <div className="flex items-center space-x-4">
        <img
          className="hidden h-10 w-10 md:inline"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      <div className="flex items-center justify-evenly">
        <HiOutlineSwitchHorizontal className="button" />
        <AiFillStepBackward className="button" />
        {isPlaying ? (
          <HiPause onClick={handlePlayPause} className="button h-10 w-10" />
        ) : (
          <HiPlay onClick={handlePlayPause} className="button h-10 w-10" />
        )}
        <AiFillStepForward className="button" />
        <ImLoop className="button" />
      </div>
      <div className="flex items-center justify-end space-x-3 pr-5 md:space-x-4">
        <FiVolume1 className="button" />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          min={0}
          max={100}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  )
}

export default Player
