"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { type Group } from "~/lib/db/schema"

import { Icons } from "~/components/icons"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"

import { Input } from "~/components/ui/input"
import { updateGroup } from "../_lib/actions"
import { updateGroupSchema, type UpdateGroupSchema } from "../_lib/validations"

interface UpdateGroupSheetProps
  extends React.ComponentPropsWithRef<typeof Sheet> {
  group: Group
}

export function UpdateGroupSheet({ group, ...props }: UpdateGroupSheetProps) {
  const [isUpdatePending, startUpdateTransition] = React.useTransition()

  const form = useForm<UpdateGroupSchema>({
    resolver: zodResolver(updateGroupSchema),
    defaultValues: {
      name: group.name,
      userId: group.userId,
      description: group.description,
      isPublic: group.isPublic,
      bannerId: group.bannerId ?? "",
      info: group.info ?? "",
      youtubeLink: group.youtubeLink ?? "",
      discordLink: group.discordLink ?? "",
      githubLink: group.youtubeLink ?? "",
      xLink: group.discordLink ?? "",
    },
  })

  React.useEffect(() => {
    form.reset({
      name: group.name,
      userId: group.userId,
      description: group.description,
      isPublic: group.isPublic,
      bannerId: group.bannerId ?? "",
      info: group.info ?? "",
      youtubeLink: group.youtubeLink ?? "",
      discordLink: group.discordLink ?? "",
      githubLink: group.youtubeLink ?? "",
      xLink: group.discordLink ?? "",
    })
  }, [group, form])

  function onSubmit(input: UpdateGroupSchema) {
    startUpdateTransition(async () => {
      const { error } = await updateGroup({
        id: group.id,
        ...input,
      })

      if (error) {
        toast.error(error)
        return
      }

      form.reset()
      props.onOpenChange?.(false)
      toast.success("Task updated")
    })
  }

  return (
    <Sheet {...props}>
      <SheetContent className="flex flex-col gap-6 sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>Update task</SheetTitle>
          <SheetDescription>
            Update the task details and save the changes
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User id</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="user id"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name"
                      className="resize-none"
                      {...field}
                    />
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
                    <Input
                      placeholder="description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Is public</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ? "true" : "false"}
                  >
                    <FormControl>
                      <SelectTrigger className="capitalize">
                        <SelectValue placeholder="Select a label" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {["true", "false"].map((item) => (
                          <SelectItem
                            key={item}
                            value={item}
                            className="capitalize"
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bannerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Id</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="banner id"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Info</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="info"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="youtubeLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Youtube link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="youtube link"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discordLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discord link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="githubLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Github link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="xLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>X link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="x link"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="gap-2 pt-2 sm:space-x-0">
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button disabled={isUpdatePending}>
                {isUpdatePending && (
                  <Icons.spinner
                    className="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Save
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
