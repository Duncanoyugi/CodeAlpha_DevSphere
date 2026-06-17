import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../app/hooks'
import { login } from '../authSlice'
import { useToast } from '../../../components/ui/use-toast'
import type { LoginInput } from '../../../types'

export function useLogin() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (data: LoginInput) => {
    setIsLoading(true)
    try {
      await dispatch(login(data)).unwrap()
      toast({
        title: 'Welcome back!',
        description: 'You have been successfully logged in.',
      })
      navigate('/feed')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return { handleLogin, isLoading }
}