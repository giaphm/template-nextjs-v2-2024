"use client"

import { Trash } from "lucide-react"
import { useState } from "react"
import { useServerAction } from "zsa-react"
import { LoaderButton } from "~/components/loader-button"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { Button } from "~/components/ui/button"
import { useToast } from "~/hooks/use-toast"
import { cn } from "~/lib/utils"
import { btnIconStyles, btnStyles } from "~/styles/icons"
import { deletePostAction } from "./actions"

export function DeletePostButton({ postId }: { postId: number }) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const { execute, isPending } = useServerAction(deletePostAction, {
    onSuccess() {
      toast({
        title: "Success",
        description: "Post deleted successfully",
      })
    },
  })

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} className={cn(btnStyles, "w-fit")}>
          <Trash className={btnIconStyles} /> Delete Post
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Post</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this post?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoaderButton
            isLoading={isPending}
            onClick={() => {
              execute({ postId })
            }}
          >
            Delete Post
          </LoaderButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
