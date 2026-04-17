export function Placeholder({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-3xl font-black tracking-tight text-primary sm:text-4xl">{title}</h1>
      {description && <p className="mt-4 text-base text-muted">{description}</p>}
    </div>
  );
}
