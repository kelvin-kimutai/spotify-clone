import { getSession } from 'next-auth/react'
import Center from '../components/center'
import Player from '../components/player'
import SideBar from '../components/sideBar'

export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-black ">
      <main className="flex">
        <SideBar />
        <Center />
      </main>
      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context)
  return {
    props: {
      session,
    },
  }
}
