import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-5 py-20 text-center">
      <p className="text-sm font-medium text-leaf-600">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-leaf-900">This field is empty</h1>
      <p className="mt-3 text-leaf-900/70">The page you are looking for does not exist or has moved.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-leaf-700 px-5 py-2.5 font-medium text-white hover:bg-leaf-800">
        Back to home
      </Link>
    </div>
  );
}
