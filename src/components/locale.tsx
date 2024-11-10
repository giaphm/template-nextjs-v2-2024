"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

import React from "react"
import { useChangeLocale, useCurrentLocale } from "~/lib/locales/client"

export default function Locale() {
  const changeLocale = useChangeLocale()
  const locale = useCurrentLocale()

  return (
    <Select
      defaultValue={locale}
      onValueChange={(value: "en" | "vn") => changeLocale(value)}
    >
      <SelectTrigger className="w-full dark:text-black">
        <SelectValue placeholder="Locale" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">EN</SelectItem>
        <SelectItem value="vn">VN</SelectItem>
      </SelectContent>
    </Select>
  )
}
