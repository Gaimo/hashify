"use client"

import { useEffect, useState } from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ThemeSelector } from "@/components/theme-selector"

const ALGORITHMS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const
const ENCODINGS = ["hex", "base64"] as const

type Algorithm = (typeof ALGORITHMS)[number]
type Encoding = (typeof ENCODINGS)[number]

async function hash(text: string, algorithm: Algorithm, encoding: Encoding) {
  const digest = await crypto.subtle.digest(algorithm, new TextEncoder().encode(text))
  const bytes = new Uint8Array(digest)
  if (encoding === "base64") {
    return btoa(String.fromCharCode(...bytes))
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")
}

export function Hasher() {
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256")
  const [encoding, setEncoding] = useState<Encoding>("hex")
  const [uppercase, setUppercase] = useState(false)
  const [length, setLength] = useState("")
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!input) return
    let cancelled = false
    hash(input, algorithm, encoding).then((result) => {
      if (!cancelled) setOutput(result)
    })
    return () => {
      cancelled = true
    }
  }, [input, algorithm, encoding])

  const result = input ? output : ""
  const cased = encoding === "hex" && uppercase ? result.toUpperCase() : result
  const limit = Number.parseInt(length, 10)
  const displayed = limit > 0 ? cased.slice(0, limit) : cased

  async function copy() {
    await navigator.clipboard.writeText(displayed)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside className="flex flex-col gap-6 border-b bg-muted/40 p-6 md:w-64 md:border-r md:border-b-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold">Hashify</h1>
          <p className="text-sm text-muted-foreground">Hash text in your browser.</p>
        </div>
        <Separator />
        <FieldSet>
          <FieldLegend variant="label">Algorithm</FieldLegend>
          <RadioGroup value={algorithm} onValueChange={(v) => setAlgorithm(v as Algorithm)}>
            {ALGORITHMS.map((a) => (
              <Field key={a} orientation="horizontal">
                <RadioGroupItem value={a} id={`algo-${a}`} />
                <FieldLabel htmlFor={`algo-${a}`} className="font-normal">
                  {a}
                </FieldLabel>
              </Field>
            ))}
          </RadioGroup>
        </FieldSet>
        <FieldSet>
          <FieldLegend variant="label">Output encoding</FieldLegend>
          <RadioGroup value={encoding} onValueChange={(v) => setEncoding(v as Encoding)}>
            {ENCODINGS.map((e) => (
              <Field key={e} orientation="horizontal">
                <RadioGroupItem value={e} id={`enc-${e}`} />
                <FieldLabel htmlFor={`enc-${e}`} className="font-normal">
                  {e === "hex" ? "Hex" : "Base64"}
                </FieldLabel>
              </Field>
            ))}
          </RadioGroup>
        </FieldSet>
        <Field orientation="horizontal" data-disabled={encoding !== "hex" || undefined}>
          <FieldContent>
            <FieldLabel htmlFor="uppercase">Uppercase</FieldLabel>
            <FieldDescription>Hex output only.</FieldDescription>
          </FieldContent>
          <Switch
            id="uppercase"
            checked={uppercase}
            onCheckedChange={setUppercase}
            disabled={encoding !== "hex"}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="length">Output length</FieldLabel>
          <Input
            id="length"
            type="number"
            inputMode="numeric"
            min={1}
            value={length}
            onChange={(e) => setLength(e.target.value)}
            placeholder="Full"
          />
          <FieldDescription>Keep only the first N characters. Leave empty for the full hash.</FieldDescription>
        </Field>
        <Separator className="md:mt-auto" />
        <ThemeSelector />
      </aside>

      <main className="flex flex-1 flex-col p-6">
        <FieldGroup className="flex-1 lg:grid lg:grid-cols-2">
          <Field className="flex-1">
            <div className="flex h-7 items-center">
              <FieldLabel htmlFor="input">Input</FieldLabel>
            </div>
            <Textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste text to hash…"
              className="min-h-40 flex-1 resize-none font-mono"
            />
          </Field>
          <Field className="flex-1">
            <div className="flex h-7 items-center justify-between">
              <FieldLabel htmlFor="output">Output</FieldLabel>
              <Button variant="ghost" size="sm" onClick={copy} disabled={!displayed}>
                {copied ? <CheckIcon data-icon="inline-start" /> : <CopyIcon data-icon="inline-start" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
            <Textarea
              id="output"
              value={displayed}
              readOnly
              placeholder="The hash will appear here."
              className="min-h-40 flex-1 resize-none font-mono break-all"
            />
          </Field>
        </FieldGroup>
      </main>
    </div>
  )
}
