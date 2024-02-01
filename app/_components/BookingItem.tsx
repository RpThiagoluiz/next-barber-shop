import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"

export const BookingItem = () => {
  return (
    <Card>
      <CardContent className="p-5 py-0 flex flex-row justify-between">
        <div className="flex flex-col gap-3 py-5">
          <Badge className="w-fit  bg-[#221c3d] text-primary hover:bg-[#221c3d] ">Confirmado</Badge>
          <h2 className="font-bold">Corte de Cabelo</h2>

          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src='https://utfs.io/f/2118f76e-89e4-43e6-87c9-8f157500c333-b0ps0b.png' />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <h3 className="text-sm">Vintage Barber</h3>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-3 border-l border-solid border-secondary">
          <p className="text-sm">Fevereiro</p>
          <p className="text-2xl">06</p>
          <p className="text-sm">09:45</p>

        </div>
      </CardContent>
    </Card>
  )
}