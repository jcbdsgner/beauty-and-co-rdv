import Link from "next/link";
import { footerServices } from "@/lib/data/services";

export default function ServicesPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="text-[31px] font-semibold tracking-tight">Services</h1>
      <ul className="mt-6 flex flex-col gap-2">
        {footerServices.map((service) => (
          <li key={service.slug}>
            <Link href={`/services/${service.slug}`} className="text-black/60 hover:text-black">
              {service.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
