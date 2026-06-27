"use client"

import { useState } from "react"
import { Pin } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type PinToggleFieldProps = {
  defaultChecked?: boolean
}

export function PinToggleField({ defaultChecked = false }: PinToggleFieldProps) {
  const [checked, setChecked] = useState(defaultChecked)

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 px-4 py-3">
      <div className="space-y-1">
        <Label htmlFor="is_pinned" className="flex items-center gap-2 text-base font-medium">
          <Pin className="h-4 w-4 text-[#002065]" />
          상단 고정
        </Label>
        <p className="text-sm text-muted-foreground">
          활성화하면 목록 최상단에 고정되고 핀 아이콘이 표시됩니다.
        </p>
      </div>
      <Switch id="is_pinned" checked={checked} onCheckedChange={setChecked} />
      <input type="hidden" name="is_pinned" value={checked ? "1" : "0"} />
    </div>
  )
}
