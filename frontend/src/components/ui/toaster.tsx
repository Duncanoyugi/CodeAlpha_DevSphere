import * as ToastPrimitive from '@radix-ui/react-toast'
import { useState } from 'react'

export const Toaster = () => {
  const [open, setOpen] = useState(false)
  
  return (
    <ToastPrimitive.Provider>
      <ToastPrimitive.Root open={open} onOpenChange={setOpen}>
        <ToastPrimitive.Title />
        <ToastPrimitive.Description />
        <ToastPrimitive.Close />
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>
  )
}