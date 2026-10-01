"use client"

import { useSyncExternalStore } from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Field, FieldLabel } from "@/components/ui/field"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const subscribe = () => () => {}

export function ThemeSelector() {
  const { resolvedTheme, setTheme } = useTheme()
  // The theme is only known on the client; avoid a hydration mismatch.
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)
  const value = mounted && resolvedTheme ? [resolvedTheme] : []

  return (
    <Field>
      <FieldLabel>Theme</FieldLabel>
      <ToggleGroup
        variant="outline"
        value={value}
        onValueChange={(v) => v[0] && setTheme(v[0])}
        aria-label="Theme"
      >
        <ToggleGroupItem value="light" aria-label="Light">
          <SunIcon data-icon="inline-start" />
          Light
        </ToggleGroupItem>
        <ToggleGroupItem value="dark" aria-label="Dark">
          <MoonIcon data-icon="inline-start" />
          Dark
        </ToggleGroupItem>
      </ToggleGroup>
    </Field>
  )
}
