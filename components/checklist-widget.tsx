"use client"

import * as React from "react"
import { CheckCircle2, ChevronDown, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"

/* -------------------------------------------------------------------------- */
/*  Tasks                                                                      */
/*  This is the one array you edit. Set 3–5 specific, high-signal tasks that   */
/*  walk a brand-new user to their first "aha" moment.                         */
/* -------------------------------------------------------------------------- */

export type Task = {
  id: string
  label: string
  done: boolean
}

const INITIAL_TASKS: Task[] = [
  { id: "install", label: "Install shadcn/ui", done: true },
  { id: "add", label: "Add the checklist widget", done: true },
  { id: "tasks", label: "Set your 3–5 tasks", done: false },
  { id: "persist", label: "Connect it to your db", done: false },
  { id: "mount", label: "Drop it in your dashboard", done: false },
]

/* -------------------------------------------------------------------------- */
/*  Persistence boundary                                                       */
/*  Onboarding state is per-user and must survive refreshes/sessions. Swap     */
/*  these two stubs for your DB/API calls (e.g. a `user.onboarding` row).      */
/* -------------------------------------------------------------------------- */

function loadOnboardingState(): Task[] {
  // TODO: fetch the signed-in user's saved task state from your DB/API.
  return INITIAL_TASKS
}

function saveOnboardingState(_tasks: Task[], _dismissed: boolean): void {
  // TODO: persist task completion + the dismissed flag against the user record.
}

/* -------------------------------------------------------------------------- */
/*  Progress ring                                                              */
/*  shadcn has no circular progress, so this is a tiny inline SVG. It uses     */
/*  semantic tokens via `currentColor`, so it themes automatically.            */
/* -------------------------------------------------------------------------- */

function ProgressRing({
  value,
  className,
}: {
  value: number // 0..1
  className?: string
}) {
  const size = 36
  const stroke = 3
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={cn("size-9 -rotate-90", className)}
      aria-hidden
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={stroke}
        className="stroke-muted"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - value)}
        className="stroke-foreground transition-[stroke-dashoffset] duration-500 ease-out"
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/*  Checklist widget                                                           */
/* -------------------------------------------------------------------------- */

export function ChecklistWidget({
  className,
  // Off by default: the checklist reflects real onboarding state from your
  // app/DB. Set `editable` to allow click-to-complete (one-way) in a demo.
  editable = false,
}: {
  className?: string
  editable?: boolean
}) {
  const [tasks, setTasks] = React.useState<Task[]>(loadOnboardingState)
  const [dismissed, setDismissed] = React.useState(false)
  const [hidden, setHidden] = React.useState(false)
  const [open, setOpen] = React.useState(true)
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  const completed = tasks.filter((t) => t.done).length
  const total = tasks.length
  // The "next" recommended step is the first task that isn't done yet.
  const nextId = tasks.find((t) => !t.done)?.id ?? null
  const allDone = completed === total

  // Remove the widget from the DOM once every task is complete — not just on
  // dismiss. Short delay so the final check registers before it disappears.
  const completedOnce = React.useRef(false)
  React.useEffect(() => {
    if (allDone && !completedOnce.current) {
      completedOnce.current = true
      const timer = setTimeout(() => setHidden(true), 900)
      return () => clearTimeout(timer)
    }
  }, [allDone])

  // Completing a task is one-way: tasks are marked done as the user actually
  // performs them, so a done task can't be un-done from the checklist.
  function complete(id: string) {
    setTasks((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, done: true } : t))
      saveOnboardingState(next, dismissed)
      return next
    })
  }

  function dismiss() {
    setDismissed(true)
    saveOnboardingState(tasks, true)
  }

  if (dismissed || hidden) return null

  return (
    <Card
      className={cn(
        "w-80 gap-0 py-0 duration-300 animate-in fade-in-0 slide-in-from-bottom-2",
        className
      )}
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <CardHeader className="flex flex-row items-center gap-3 py-4">
          <ProgressRing value={total === 0 ? 0 : completed / total} />
          <div className="flex flex-col gap-0">
            <CardTitle>Get started</CardTitle>
            <CardDescription>
              {completed} of {total} complete
            </CardDescription>
          </div>
          <CollapsibleTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto text-muted-foreground"
              />
            }
          >
            <ChevronDown
              className={cn(
                "transition-transform duration-200",
                !open && "-rotate-90"
              )}
            />
            <span className="sr-only">
              {open ? "Collapse" : "Expand"} checklist
            </span>
          </CollapsibleTrigger>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pb-2">
            <ItemGroup className="gap-0">
              {tasks.map((task) => {
                const isNext = task.id === nextId
                // Only the current "next" step is clickable (and only when
                // editable) — done steps are locked, later steps wait their turn.
                const interactive = editable && isNext
                return (
                  <Item
                    key={task.id}
                    variant={isNext ? "muted" : "default"}
                    size="sm"
                    className={cn(
                      "py-1.5 text-left",
                      interactive && "cursor-pointer hover:bg-muted/50"
                    )}
                    render={
                      interactive ? (
                        <button
                          type="button"
                          onClick={() => complete(task.id)}
                        />
                      ) : undefined
                    }
                  >
                    <ItemMedia variant="icon">
                      {task.done ? (
                        <CheckCircle2 className="text-accent-foreground" />
                      ) : (
                        <Circle className="text-muted-foreground" />
                      )}
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle
                        className={cn(
                          task.done && "text-muted-foreground line-through"
                        )}
                      >
                        {task.label}
                      </ItemTitle>
                    </ItemContent>
                    {isNext && (
                      <ItemActions>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </ItemActions>
                    )}
                  </Item>
                )
              })}
            </ItemGroup>
          </CardContent>

          <CardFooter className="mt-2 flex-col items-stretch gap-3">
            <p className="text-xs text-muted-foreground">
              Dismissing hides this widget for good. You can finish any task
              later from Settings under Onboarding.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setConfirmOpen(true)}
            >
              Dismiss forever
            </Button>
          </CardFooter>
        </CollapsibleContent>
      </Collapsible>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Dismiss the setup checklist?</AlertDialogTitle>
            <AlertDialogDescription>
              This hides the widget for good. You can still finish these tasks
              anytime from Settings → Onboarding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={dismiss}>
              Dismiss forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
