'use client'

import { Button } from '@/app/_components/ui/button'
import { Calendar } from '@/app/_components/ui/calendar'
import { Card, CardContent } from '@/app/_components/ui/card'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/app/_components/ui/sheet'
import { Barbershop, Booking, Service } from '@prisma/client'
import { ptBR } from 'date-fns/locale'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { generateDayTimeList } from '../_helpers/hours'
import { addDays, format, setHours, setMinutes } from 'date-fns'
import { saveBooking } from '../_actions/saveBocking'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { getDayBookings } from '../_actions/getDatBookings'

type ServiceItemProps = {
  barberShop: Barbershop
  service: Service
  isAuthenticated: boolean
}

export const ServiceItem = ({ barberShop, service, isAuthenticated }: ServiceItemProps) => {
  const userSession = useSession()
  const router = useRouter();

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [hour, setHour] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [sheetIsOpen, setSheetIsOpen] = useState<boolean>(false);
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);

  const timeList = useMemo(() => {
    if (!date) {
      return [];
    }

    return generateDayTimeList(date).filter((time) => {
      const [timeHour, timeMinutes] = time.split(':')

      const booking = dayBookings.find((booking) => {
        const bookingHour = booking.date.getHours();
        const bookingMinutes = booking.date.getMinutes();

        return bookingHour === Number(timeHour) && bookingMinutes === Number(timeMinutes);
      });

      if (!booking) {
        return true;
      }

      return false;
    });
  }, [date, dayBookings]);



  useEffect(() => {
    if (!date) {
      return;
    }

    const refreshAvailableHours = async () => {
      const _dayBookings = await getDayBookings(barberShop.id, date);
      setDayBookings(_dayBookings);
    };

    refreshAvailableHours();
  }, [date, barberShop.id]);

  const handleBooking = () => {
    if (!isAuthenticated) {
      return signIn('google')
    }
  }

  const handleBookingSubmit = async () => {
    setIsSubmitting(true)
    try {

      if (!hour || !date || !userSession.data?.user) {
        return
      }



      const [formatHour, formatMin] = hour.split(':')

      const scheduleDate = setMinutes(setHours(date, Number(formatHour)), Number(formatMin))

      await (saveBooking({
        barbershopId: barberShop.id,
        serviceId: service.id,
        date: scheduleDate,
        userId: (userSession.data.user as any).id,
      }))

      setSheetIsOpen(false)
      setHour(undefined)
      setDate(undefined)

      toast("Reserva realizada com sucesso!", {
        description: format(scheduleDate, "'Para' dd 'de' MMMM 'às' HH':'mm'.'", {
          locale: ptBR,
        }),
        action: {
          label: "Visualizar",
          onClick: () => router.push("/bookings"),
        },
      });
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
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
              <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild>
                  <Button variant='secondary' onClick={handleBooking}>
                    Reservar
                  </Button>
                </SheetTrigger>

                <SheetContent className='p-0'>
                  <SheetHeader className='text-left py-6 px-5 border-b border-solid border-secondary'>
                    <SheetTitle>
                      Fazer Reserva
                    </SheetTitle>
                  </SheetHeader>

                  <div className="py-6">
                    <Calendar
                      mode='single'
                      selected={date}
                      onSelect={(date) => {
                        setDate(date)
                        setHour(undefined)
                      }}
                      locale={ptBR}
                      fromDate={addDays(new Date(), 1)}
                      className='mt-6'
                      styles={{
                        head_cell: {
                          width: '100%',
                          textTransform: 'capitalize'
                        },
                        cell: {
                          width: '100%',
                        },
                        button: {
                          width: '100%',
                        },
                        nav_button_previous: {
                          width: '32px',
                          height: '32px',
                        },
                        nav_button_next: {
                          width: '32px',
                          height: '32px',
                        },
                        caption: {
                          textTransform: 'capitalize'
                        },
                      }}
                    />
                  </div>
                  {date && (
                    <div className="flex gap-3 overflow-x-auto py-6 px-5 border-t border-solid border-secondary [&::-webkit-scrollbar]:hidden">
                      {timeList.map((time) => (
                        <Button
                          onClick={() => setHour(time)}
                          variant={hour === time ? "default" : "outline"}
                          className="rounded-full"
                          key={time}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                  <section className="py-6 px-5 border-t border-solid border-secondary">
                    <Card>
                      <CardContent className='p-3 flex flex-col gap-3'>
                        <div className="flex justify-between">
                          <h2 className='font-bold'>{service.name}</h2>
                          <h3 className='font-bold text-sm'>{Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(Number(service.price))}</h3>
                        </div>
                        {date && (
                          <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm">Data</h3>
                            <h4 className="text-sm">{format(date, "dd 'de' MMMM ", {
                              locale: ptBR
                            })}</h4>
                          </div>
                        )}

                        {hour && (
                          <div className="flex justify-between">
                            <h3 className="text-gray-400 text-sm">Horário</h3>
                            <h4 className="text-sm">{hour}</h4>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <h3 className="text-gray-400 text-sm">Barbearia</h3>
                          <h4 className="text-sm">{barberShop.name}</h4>
                        </div>



                      </CardContent>
                    </Card>


                  </section>
                  <SheetFooter className='px-5'>
                    <Button onClick={handleBookingSubmit} disabled={!hour || !date || isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Confirmar reservaReserva</Button>
                  </SheetFooter>

                </SheetContent>
              </Sheet>

            </div>
          </div>

        </section>
      </CardContent>

    </Card>
  )
}
