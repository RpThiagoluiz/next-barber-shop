import { redirect } from "next/navigation";
import { db } from "../_lib/prisma";
import { Search } from "../_components/Search";
import { Header } from "../_components/Header";
import { BarbershopItem } from "../_components/BarbershopItem";


type BarbershopsPageProps = {
  searchParams: {
    search?: string;
  };
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
  if (!searchParams.search) {
    return redirect("/");
  }

  const barbershops = await db.barbershop.findMany({
    where: {
      name: {
        contains: searchParams.search,
        mode: "insensitive",
      },
    },
  });

  return (
    <>
      <Header />

      <main className="px-5 py-6 flex flex-col gap-6">
        <Search
          defaultValues={{
            search: searchParams.search,
          }}
        />

        <h1 className="text-gray-400 font-bold text-xs uppercase">Resultados para &quot;{searchParams.search}&quot;</h1>

        <article className="grid grid-cols-2 gap-4">
          {barbershops.map((barbershop) => (
            <section key={barbershop.id} className="w-full">
              <BarbershopItem barbershop={barbershop} />
            </section>
          ))}

          {barbershops.length === 0 && (

            <h4 className="text-center text-red-500 mt-16">Nenhum resultado encontrado</h4>

          )}
        </article>
      </main>
    </>
  );
};

export default BarbershopsPage;