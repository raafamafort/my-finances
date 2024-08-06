import { authOptions } from "@lib/auth/auth";
import { getServerSession } from "next-auth";

const page = async () => {
  const session = await getServerSession(authOptions)

  console.log("session", session)

  return (
    <main>
      <h1>Welcome {session?.user.name}</h1>
    </main>
  )
}

export default page;