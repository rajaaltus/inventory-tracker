import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export type AuthFlow = "signIn" | "signUp"

type LoginFormProps = Omit<React.ComponentProps<"form">, "children"> & {
  flow?: AuthFlow
  onToggleFlow?: () => void
  error?: string | null
  loading?: boolean
}

export const LoginForm = ({
  className,
  flow = "signIn",
  onToggleFlow = () => {},
  error = null,
  loading = false,
  ...props
}: LoginFormProps) => {
  const handleToggleFlowClick = () => {
    onToggleFlow()
  }

  const handleToggleFlowKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onToggleFlow()
    }
  }

  const isSignIn = flow === "signIn"

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {isSignIn ? "Login to your account" : "Create an account"}
          </h1>
          <p className="text-sm text-balance text-muted-foreground">
            {isSignIn
              ? "Enter your email below to login to your account"
              : "Enter your email and password to sign up"}
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            autoComplete="email"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
            autoComplete={isSignIn ? "current-password" : "new-password"}
          />
          {!isSignIn && (
            <FieldDescription>Password must be at least 8 characters</FieldDescription>
          )}
        </Field>
        {error ? <FieldError>{error}</FieldError> : null}
        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Loading..." : isSignIn ? "Sign in" : "Sign up"}
          </Button>
        </Field>
        <FieldDescription className="text-center">
          {isSignIn ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            className="text-foreground underline underline-offset-4 hover:text-primary"
            onClick={handleToggleFlowClick}
            onKeyDown={handleToggleFlowKeyDown}
            tabIndex={0}
            aria-label={isSignIn ? "Switch to sign up" : "Switch to sign in"}
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </button>
        </FieldDescription>
      </FieldGroup>
    </form>
  )
}
