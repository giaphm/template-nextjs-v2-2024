"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import React, { useContext } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createGroupFormSchema } from "./validation"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { LoaderButton } from "~/components/loader-button"
import { CheckIcon } from "lucide-react"
import { Input } from "~/components/ui/input"
import { ToggleContext } from "~/components/interactive-overlay"
import { useToast } from "~/hooks/use-toast"
import { useServerAction } from "zsa-react"
import { createGroupAction } from "../actions"
import { btnIconStyles } from "~/styles/icons"
import { Textarea } from "~/components/ui/textarea"

export default function CreateGroupForm() {
  const { setIsOpen, preventCloseRef } = useContext(ToggleContext)
  const { toast } = useToast()
  const { execute, isPending } = useServerAction(createGroupAction, {
    onStart() {
      preventCloseRef.current = true
    },
    onFinish() {
      preventCloseRef.current = false
    },
    onError({ err }) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      })
    },
    onSuccess() {
      toast({
        title: "Group Created",
        description: "You can now start managing your events",
      })
      setIsOpen(false)
    },
  })

  const form = useForm<z.infer<typeof createGroupFormSchema>>({
    resolver: zodResolver(createGroupFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          execute(values).then(() => {})
        })}
        className="flex flex-1 flex-col gap-4 px-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea rows={7} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoaderButton isLoading={isPending} type="submit">
          <CheckIcon className={btnIconStyles} /> Create Group
        </LoaderButton>
      </form>
    </Form>
  )
}
