"use client"

import React, { useState } from "react"
import InteractiveOverlay from "~/components/interactive-overlay"
import CreateGroupForm from "./create-group-form"
import { Button } from "@react-email/components"
import { btnIconStyles, btnStyles } from "~/styles/icons"
import { PlusCircle } from "lucide-react"

export default function CreateGroupButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <>
      <InteractiveOverlay
        title={"Create Group"}
        description={"Create a new group to start managing your events."}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        form={<CreateGroupForm />}
      />

      <Button
        onClick={() => {
          setIsOpen(true)
        }}
        className={btnStyles}
      >
        <PlusCircle className={btnIconStyles} />
        Create Group
      </Button>
    </>
  )
}
