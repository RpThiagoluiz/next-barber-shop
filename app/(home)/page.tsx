import { Header } from "../_components/Header";
import { format } from 'date-fns'
import { ptBR } from "date-fns/locale";
import { Search } from "./_components/Search";
import { BookingItem } from "../_components/BookingItem";
import { db } from "../_lib/prisma";
import { BarbershopItem } from "./_components/BarbershopItem";
import { Barbershop } from "@prisma/client"

export default async function Home() {
  const barbershops: Barbershop[] = await db.barbershop.findMany()

  return (
    <main className="">
      <Header />

      <section className="p-5">
        <h2 className="text-xl font-bold">Olá, Thiago!</h2>
        <p className="capitalize text-sm">{format(Date.now(), "EEEE',' d 'de' MMMM", {
          locale: ptBR,
        })}</p>

      </section>

      <section className="px-5 mt-6">
        <Search />
      </section>

      <section className="px-5 mt-6">
        <h2 className="mb-3 text-xs uppercase text-gray-400">Agendamentos</h2>
        <BookingItem />
      </section>

      <article className="px-5 mt-6">
        <h2 className="mb-3 text-xs uppercase text-gray-400">Recomendados</h2>

        <section className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => <BarbershopItem key={barbershop.id} barbershop={barbershop} />)}
        </section>
      </article>

      <article className="px-5 mt-6 mb-[4.5rem]">
        <h2 className="mb-3 text-xs uppercase text-gray-400">Populares</h2>

        <section className="flex px-5 gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {barbershops.map((barbershop) => <BarbershopItem key={barbershop.id} barbershop={barbershop} />)}
        </section>
      </article>

    </main>
  );
}
