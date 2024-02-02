import { db } from "@/app/_lib/prisma"
import { BarbershopInfo } from "./_components/barbershopInfo"
import { ServiceItem } from "./_components/serviceItem"
import { Service } from '@prisma/client'
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"


type BarbershopDetailsPage = {
  params: {
    id?: string
  }
}


const BarbershopDetailsPage = async ({ params }: BarbershopDetailsPage) => {

  const session = await getServerSession(authOptions)

  if (!params.id) {
    //TODO: redirecionar para home page
    return null
  }

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: params.id
    },
    include: {
      services: true
    }
  })


  if (!barbershop) {
    //TODO: redirecionar para home page
    return null
  }


  return (
    <article>
      <BarbershopInfo barbershop={barbershop} />

      <div className="px-5 py-6 flex flex-col gap-4">
        {barbershop.services.map((service: Service) => <ServiceItem key={service.id} service={service} isAuthenticated={!!session?.user} />)}
      </div>



    </article>

  )
}


export default BarbershopDetailsPage