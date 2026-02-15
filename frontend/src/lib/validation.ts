const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(s: string): boolean {
  return EMAIL_REGEX.test((s || '').trim());
}

export function validateContact(data: { name?: string; email?: string; message?: string }): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!(data.name || '').trim()) errs.name = 'validation.nameRequired';
  if (!(data.email || '').trim()) errs.email = 'validation.emailRequired';
  else if (!isValidEmail(data.email!)) errs.email = 'validation.emailInvalid';
  if (!(data.message || '').trim()) errs.message = 'validation.messageRequired';
  return errs;
}

export function validateNewsletter(email: string): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!email?.trim()) errs.email = 'validation.emailRequired';
  else if (!isValidEmail(email)) errs.email = 'validation.emailInvalid';
  return errs;
}
