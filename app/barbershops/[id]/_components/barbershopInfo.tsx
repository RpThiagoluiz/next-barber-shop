'use client'

import { Button } from "@/app/_components/ui/button"
import { Barbershop } from "@prisma/client"
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

type BarbershopInfoProps = {
  barbershop: Barbershop
}


export const BarbershopInfo = ({ barbershop }: BarbershopInfoProps) => {
  const router = useRouter()

  return (
    <>
      <section className="h-[250px] w-full relative">
        <Button size='icon' variant='outline' className="z-50 absolute top-4 left-4" onClick={router.back}><ChevronLeftIcon /></Button>
        <Button size='icon' variant='outline' className="z-50 absolute top-4 right-4"><MenuIcon /></Button>
        <Image
          className="opacity-75"
          src={barbershop.imageUrl} fill alt={barbershop.name} style={{ objectFit: 'cover' }}
        />
      </section>

      <section className="px-5 py-3 pb-6 border-b border-solid border-secondary">
        <h1 className="text-xl font-bold">{barbershop.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <MapPinIcon className="text-primary" size={18} />
          <p className="text-sm">{barbershop.name}</p></div>
        <div className="flex items-center gap-2 mt-2">
          <StarIcon className="text-primary" size={18} />
          <p className="text-sm">4.8 (18 avaliações)</p></div>
      </section>
    </>
  )
}
