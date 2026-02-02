import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Save } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"

/* ---------------- Zod Schema ---------------- */
const accountFormSchema = z.object({
  accountName: z
    .string()
    .min(3, "Account name must be at least 3 characters")
    .max(50),
  firstLevel: z.string({
    required_error: "Please select the first level",
  }),
  secondLevel: z.string().optional(),
  thirdLevel: z.string().optional(),
  enabled: z.enum(["yes", "no"]),
  lastLevel: z.enum(["yes", "no"]),
})

export default function ChartOfAccount() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      accountName: "",
      firstLevel: "",
      secondLevel: "",
      thirdLevel: "",
      enabled: "yes",
      lastLevel: "no",
    },
  })

  async function onSubmit(data) {
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 2000))
    console.log("Form Submitted:", data)
    setIsSubmitting(false)
  }

  return (
    <div className="flex justify-center items-center  bg-slate-50 p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="border-b mt-[-4]">
          <CardTitle className="text-2xl font-bold">
            Chart of Account Information
          </CardTitle>
         
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6 pt-6">

              {/* Account Name */}
              <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Account Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Petty Cash" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Level */}
                <FormField
                  control={form.control}
                  name="firstLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Level *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="assets">Assets</SelectItem>
                          <SelectItem value="liabilities">Liabilities</SelectItem>
                          <SelectItem value="equity">Equity</SelectItem>
                          <SelectItem value="revenue">Revenue</SelectItem>
                          <SelectItem value="expenses">Expenses</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Second Level */}
                <FormField
                  control={form.control}
                  name="secondLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Second Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sub-level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="current">Current</SelectItem>
                          <SelectItem value="non-current">Non-current</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                {/* Third Level */}
                <FormField
                  control={form.control}
                  name="thirdLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Third Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="inventory">Inventory</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {/* Radio Section */}
              <div className=" p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="enabled"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enabled</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4"
                        >
                          <RadioGroupItem value="yes" /> Yes
                          <RadioGroupItem value="no" /> No
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Level</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-4"
                        >
                          <RadioGroupItem value="yes" /> Yes
                          <RadioGroupItem value="no" /> No
                        </RadioGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end  p-6">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Account
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
