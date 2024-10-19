"use client"

import React, { createContext, ReactNode, useRef } from "react"
import useMediaQuery from "~/hooks/use-media-query"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"
import { ScrollArea } from "~/components/ui/scroll-area"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "~/components/ui/drawer"

type ToggleContextType = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  preventCloseRef: React.MutableRefObject<boolean>
}

export const ToggleContext = createContext<ToggleContextType>({
  isOpen: false,
  setIsOpen: () => {},
  preventCloseRef: { current: false },
})

export default function InteractiveOverlay({
  isOpen,
  setIsOpen,
  title,
  description,
  form,
}: {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  form: ReactNode
  title: string
  description: string
}) {
  const { isMobile } = useMediaQuery()
  const preventCloseRef = useRef<boolean>(false)

  return (
    <ToggleContext.Provider
      value={{
        isOpen,
        setIsOpen,
        preventCloseRef,
      }}
    >
      {!isMobile ? (
        <Sheet
          open={isOpen}
          onOpenChange={(value) => {
            if (preventCloseRef.current) return
            setIsOpen(value)
          }}
        >
          <SheetContent>
            <SheetHeader className="px-2">
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>

            <ScrollArea className="h-[95%] pb-8 pr-8 pt-4">{form}</ScrollArea>
          </SheetContent>
        </Sheet>
      ) : (
        <Drawer
          open={isOpen}
          onOpenChange={(value) => {
            if (preventCloseRef.current) return
            setIsOpen(value)
          }}
        >
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            <ScrollArea className="overflow-y-auto px-8 pb-8">
              {form}
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      )}
    </ToggleContext.Provider>
  )
}
