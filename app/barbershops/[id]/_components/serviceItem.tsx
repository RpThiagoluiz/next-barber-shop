'use client'
import { Button } from '@/app/_components/ui/button'
import { Card, CardContent } from '@/app/_components/ui/card'
import { Service } from '@prisma/client'
import { signIn } from 'next-auth/react'
import Image from 'next/image'

type ServiceItemProps = {
  service: Service
  isAuthenticated: boolean
}

export const ServiceItem = ({ service, isAuthenticated }: ServiceItemProps) => {
  const handleBooking = () => {
    if (!isAuthenticated) {
      return signIn('google')
    }

    //TODO: abrir modal de agendamento
  }

  return (
    <Card>
      <CardContent className='p-3'>
        <section className='w-full flex gap-4 items-center'>
          <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
            <Image
              src={service.imageUrl}
              alt={service.name}
              fill
              style={{
                objectFit: 'contain'
              }}
              className='rounded-lg'
            />
          </div>
          <div className="flex flex-col w-full">
            <h2 className="font-bold">
              {service.name}
            </h2>
            <p className="text-sm">{service.description}</p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-primary text-md font-bold">
                {Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(Number(service.price))}
              </p>
              <Button variant='secondary' onClick={handleBooking}>
                Reservar
              </Button>
            </div>
          </div>

        </section>
      </CardContent>

    </Card>
  )
}
