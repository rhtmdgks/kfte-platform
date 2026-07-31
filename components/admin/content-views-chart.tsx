"use client"

import { useMemo } from "react"
import { motion, useReducedMotion } from "motion/react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { MotionReveal } from "@/components/motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ViewTrendPoint } from "@/lib/content-view-analytics"
import { springGentle } from "@/lib/animation-presets"

const chartConfig = {
  views: {
    label: "조회수",
    color: "#002065",
  },
}

type ContentViewsChartProps = {
  title: string
  description?: string
  data: ViewTrendPoint[]
  totalViews: number
}

export function ContentViewsChart({
  title,
  description,
  data,
  totalViews,
}: ContentViewsChartProps) {
  const reduceMotion = useReducedMotion()
  const tickInterval = useMemo(() => Math.max(Math.floor(data.length / 6), 1), [data.length])

  return (
    <MotionReveal>
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle className="text-lg text-[#002065]">{title}</CardTitle>
            {description ? (
              <CardDescription className="text-sm">{description}</CardDescription>
            ) : null}
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">최근 30일 합계</p>
            <motion.p
              className="text-3xl font-bold tabular-nums text-[#002065]"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={springGentle}
            >
              {totalViews.toLocaleString("ko-KR")}
            </motion.p>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="aspect-[2.4/1] h-[280px] w-full">
            <AreaChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                interval={tickInterval}
                minTickGap={24}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={36}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={{ stroke: "#002065", strokeOpacity: 0.15 }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const point = payload?.[0]?.payload as ViewTrendPoint | undefined
                      return point?.day ?? ""
                    }}
                  />
                }
              />
              <defs>
                <linearGradient id="viewsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#002065" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#002065" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="views"
                stroke="#002065"
                strokeWidth={2}
                fill="url(#viewsFill)"
                dot={false}
                activeDot={{ r: 4, fill: "#002065" }}
                isAnimationActive={!reduceMotion}
                animationDuration={900}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </MotionReveal>
  )
}
