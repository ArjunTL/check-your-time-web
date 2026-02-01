"use client";

import { useParams } from "next/navigation";
import AddEditResultForm from "../../../../../components/AddEditResultForm";

export default function EditResultPage() {
  const params = useParams();
  const id = params?.id as string;

  return <AddEditResultForm id={id} />;
}
