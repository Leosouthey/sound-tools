"use client";

import { Pagination } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export function PaginationNav({
  total,
  page,
}: {
  total: number;
  page: number;
}) {
  const router = useRouter();
  const onChange = (page: number) => {
    router.push(`/market/${page}`);
  };
  return <Pagination total={total} page={page} onChange={onChange} />;
}
