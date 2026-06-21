import {
  Bell,
  Home,
  LayoutGrid,
  Search,
  Settings,
  Users,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChecklistWidget } from "@/components/checklist-widget"

// Mock "Application Pro" dashboard shell. This is stage dressing so the
// ChecklistWidget has realistic context in the bottom corner — the widget
// itself is the reusable piece.

const NAV = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: LayoutGrid, label: "Projects" },
  { icon: Users, label: "Team" },
  { icon: Bell, label: "Notifications" },
  { icon: Settings, label: "Settings" },
]

const STATS = [
  { label: "Active projects", value: "12", hint: "+2 this week" },
  { label: "Team members", value: "8", hint: "3 invited" },
  { label: "Data sources", value: "0", hint: "Connect one to begin" },
]

export default function Page() {
  return (
    <div className="flex min-h-dvh">
      {/* Sidebar */}
      <aside className="hidden w-60 flex-col gap-6 border-r bg-card/40 p-4 md:flex">
        <div className="flex items-center gap-2 px-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground">
            A
          </div>
          <span className="font-heading text-sm font-medium">Application Pro</span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map(({ icon: Icon, label, active }) => (
            <span
              key={label}
              className={
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors " +
                (active
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted/50")
              }
            >
              <Icon className="size-4" />
              {label}
            </span>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-14 items-center gap-3 border-b px-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Search className="size-4" />
            <span className="text-sm">Search…</span>
          </div>
          <div className="ml-auto size-7 rounded-full bg-muted" />
        </header>

        {/* Content */}
        <main className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-col gap-1">
            <h1 className="font-heading text-xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back — here&apos;s what&apos;s happening today.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STATS.map((stat) => (
              <Card key={stat.label}>
                <CardHeader>
                  <CardDescription>{stat.label}</CardDescription>
                  <CardTitle className="text-2xl">{stat.value}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  {stat.hint}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>
                Your team&apos;s latest actions across projects.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {[70, 50, 85, 40].map((w, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="size-8 shrink-0 rounded-full bg-muted" />
                  <div className="flex flex-1 flex-col gap-1.5">
                    <div
                      className="h-2.5 rounded bg-muted"
                      style={{ width: `${w}%` }}
                    />
                    <div className="h-2 w-1/4 rounded bg-muted/60" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Onboarding checklist — docked to the bottom-right corner.
          `editable` lets pending steps be clicked to complete (one-way) for the
          demo; drop it for the read-only, app-state-driven default. */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChecklistWidget editable />
      </div>
    </div>
  )
}
