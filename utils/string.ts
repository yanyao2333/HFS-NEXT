// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function fillTemplate(template: string, replacements: any) {
  if (!replacements) return template
  return template.replace(
    /\$\{(.*?)}/g,
    (match, key) => replacements[key] || '',
  )
}
