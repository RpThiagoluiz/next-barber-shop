import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { MenuIcon } from "lucide-react"

export const Header = () => {
  return (
    <Card>
      <CardContent className="p-5 flex flex-row items-center justify-between">
        <Image src='/logo.png' alt="Barber shop" height={18} width={120} />
        <Button variant='outline' size='icon'>
          <MenuIcon size={16} />
        </Button>
      </CardContent>
    </Card>
  )
}
