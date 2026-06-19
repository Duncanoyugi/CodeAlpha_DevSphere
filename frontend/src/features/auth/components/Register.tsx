import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAppDispatch } from '../../../app/hooks'
import { register } from '../authSlice'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card'
import { registerSchema, type RegisterInput } from '../../../lib/validators'
import { useToast } from '../../../components/ui/use-toast'
import { APP_NAME } from '../../../lib/constants'

export function Register() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    try {
      await dispatch(register(data)).unwrap()
      toast({
        title: `Welcome to ${APP_NAME}!`,
        description: 'Your account has been created successfully.',
      })
      navigate('/feed')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Registration failed',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
      <Card className="w-full max-w-md overflow-hidden">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand)] text-sm font-bold text-[var(--brand-foreground)]">
            DS
          </div>
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Join the {APP_NAME} developer community.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="johndoe"
                {...registerField('username')}
              />
              {errors.username && (
                <p className="text-sm text-[var(--destructive)]">{errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...registerField('email')}
              />
              {errors.email && (
                <p className="text-sm text-[var(--destructive)]">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...registerField('password')}
              />
              {errors.password && (
                <p className="text-sm text-[var(--destructive)]">{errors.password.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full rounded-xl" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
            <p className="text-center text-sm text-[var(--muted-foreground)]">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[var(--brand)] transition-colors hover:text-[var(--brand)]/80">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
