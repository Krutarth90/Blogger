export function Heading({ text }: { text: string }) {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-lg mt-8">
      <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
        {text}
      </h2>
    </div>
  );
}
