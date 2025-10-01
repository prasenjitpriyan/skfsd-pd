'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to send reset link')
      }

      setSuccess(true)
    } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message)
  } else {
    setError('Failed to send reset link')
  }
}
  finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="max-w-md mx-auto w-full">
        <CardHeader>
          <CardTitle>Password Reset Requested</CardTitle>
          <CardDescription>Please check your email for further instructions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/auth/login">
            <a>Return to Login</a>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-md mx-auto w-full">
      <CardHeader>
        <CardTitle>Forgot Password</CardTitle>
        <CardDescription>Enter your email address to receive password reset instructions.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="your.email@example.com" {...register('email')} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <Button type="submit" className="w-full" loading={isLoading}>
            Send Reset Link
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

