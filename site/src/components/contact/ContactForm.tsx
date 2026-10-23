import { useState, type FormEvent } from 'react'
import { LAB } from '../../content/lab'

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'sent' } | { kind: 'error' }

const MESSAGES = {
  sent: "Thanks, your message has been noted. We'll follow up soon.",
  error: 'Something went wrong sending your message. Please try again or email us directly.',
}

const field =
  'mt-2 block w-full border border-steel bg-paper px-3 py-2 font-serif text-lg text-ink-2 focus:border-red focus:outline-none focus-visible:outline-none'

export function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const body = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    }
    setStatus({ kind: 'sending' })
    try {
      const res = await fetch(LAB.formspree, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      setStatus({ kind: 'sent' })
    } catch {
      setStatus({ kind: 'error' })
    }
  }

  const sending = status.kind === 'sending'

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-[0.12em] text-iron">
          Name
        </label>
        <input id="contact-name" name="name" type="text" required autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-[0.12em] text-iron">
          Email
        </label>
        <input id="contact-email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div>
        <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-[0.12em] text-iron">
          Message
        </label>
        <textarea id="contact-message" name="message" required rows={5} className={`${field} resize-y`} />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="bg-red px-6 py-3 text-sm font-semibold text-white hover:bg-[#9e0e26] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? 'Sending' : 'Send message'}
      </button>
      <p
        role="status"
        aria-live="polite"
        className={`min-h-6 font-serif text-lg ${status.kind === 'error' ? 'text-red' : 'text-body'}`}
      >
        {status.kind === 'sent' ? MESSAGES.sent : status.kind === 'error' ? MESSAGES.error : ''}
      </p>
    </form>
  )
}
