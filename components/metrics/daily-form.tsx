'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useApi } from '@/hooks/use-api'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { MetricsStepper } from './metrics-stepper'

const metricsSchema = z.object({
  lettersDelivered: z.number().min(0, 'Cannot be negative'),
  parcelsDelivered: z.number().min(0, 'Cannot be negative'),
  speedPostItems: z.number().min(0, 'Cannot be negative'),
  moneyOrders: z.number().min(0, 'Cannot be negative'),
  revenueCollected: z.number().min(0, 'Cannot be negative'),
  savingsAccounts: z.number().min(0, 'Cannot be negative'),
  insurancePolicies: z.number().min(0, 'Cannot be negative'),
  weatherCondition: z.string().optional(),
  temperature: z.number().optional(),
  humidity: z.number().optional(),
  postmenOnDuty: z.number().min(1, 'At least one postman required'),
  clerksOnDuty: z.number().min(1, 'At least one clerk required'),
  supervisorsOnDuty: z.number().min(1, 'At least one supervisor required'),
})

type MetricsFormData = z.infer<typeof metricsSchema>

const steps = [
  {
    title: 'Mail Services',
    description: 'Letters and parcels delivery data',
    fields: ['lettersDelivered', 'parcelsDelivered', 'speedPostItems']
  },
  {
    title: 'Financial Services',
    description: 'Money orders and revenue collection',
    fields: ['moneyOrders', 'revenueCollected']
  },
  {
    title: 'Customer Services',
    description: 'Savings accounts and insurance policies',
    fields: ['savingsAccounts', 'insurancePolicies']
  },
  {
    title: 'Operations Data',
    description: 'Weather and staffing information',
    fields: ['weatherCondition', 'temperature', 'humidity', 'postmenOnDuty', 'clerksOnDuty', 'supervisorsOnDuty']
  }
]

export function DailyForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const { post, isLoading } = useApi()

  const form = useForm<MetricsFormData>({
    resolver: zodResolver(metricsSchema),
    defaultValues: {
      lettersDelivered: 0,
      parcelsDelivered: 0,
      speedPostItems: 0,
      moneyOrders: 0,
      revenueCollected: 0,
      savingsAccounts: 0,
      insurancePolicies: 0,
      postmenOnDuty: 1,
      clerksOnDuty: 1,
      supervisorsOnDuty: 1,
    },
  })

  const onSubmit = async (data: MetricsFormData) => {
    try {
      await post('/api/metrics/daily', {
        date: new Date().toISOString().split('T'),
        metrics: {
          lettersDelivered: data.lettersDelivered,
          parcelsDelivered: data.parcelsDelivered,
          speedPostItems: data.speedPostItems,
          moneyOrders: data.moneyOrders,
          revenueCollected: data.revenueCollected,
          savingsAccounts: data.savingsAccounts,
          insurancePolicies: data.insurancePolicies,
        },
        weather: data.weatherCondition ? {
          condition: data.weatherCondition,
          temperature: data.temperature || 0,
          humidity: data.humidity || 0,
        } : undefined,
        staffOnDuty: {
          postmen: data.postmenOnDuty,
          clerks: data.clerksOnDuty,
          supervisors: data.supervisorsOnDuty,
        }
      })

toast.success("Success!", {
  description: "Daily metrics have been submitted successfully."
})
    } catch (error) {
toast.error("Error", {
  description: error instanceof Error ? error.message : "Something went wrong. Please try again."
})
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = () => {
    const currentFields = steps[currentStep].fields
    return currentFields.every(field => {
      const value = form.getValues(field as keyof MetricsFormData)
      return value !== undefined && value !== null && value !== ''
    })
  }

  return (
    <div className="space-y-6">
      <MetricsStepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep].title}</CardTitle>
              <CardDescription>{steps[currentStep].description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentStep === 0 && (
                <>
                  <FormField
                    control={form.control}
                    name="lettersDelivered"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Letters Delivered</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="parcelsDelivered"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parcels Delivered</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="speedPostItems"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Speed Post Items</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {currentStep === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="moneyOrders"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Money Orders Processed</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="revenueCollected"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Revenue Collected (₹)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {currentStep === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="savingsAccounts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Savings Accounts</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="insurancePolicies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Insurance Policies Sold</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="weatherCondition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weather Condition</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Clear, Rainy" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="temperature"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Temperature (°C)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="humidity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Humidity (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="postmenOnDuty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postmen on Duty</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="clerksOnDuty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clerks on Duty</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="supervisorsOnDuty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Supervisors on Duty</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Metrics
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
