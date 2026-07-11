import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axiosInstance from "@/shared/APIs/axiosInstance";
import { useSubmitOfferMutation } from "./useSubmitOfferMutation";
import { OfferFormState } from "../types/submitOfferForm.type";

export function useSubmitOfferForm(requestId: string) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offerId = searchParams.get("offerId");

  const { mutate, isPending } = useSubmitOfferMutation(requestId, offerId);

  const [form, setForm] = useState<OfferFormState>({
    offerTitle: "",
    price: 0,
    deliveryTime: "",
    condition: "new",
    description: "",
    images: [],
    pickupLocation: "",
    deliveryArea: "",
  });

  useEffect(() => {
    async function loadExistingOffer() {
      try {
        const res = await axiosInstance.get("/offers/my?limit=100");
        const list = res.data?.data?.offers || res.data?.offers || Array.isArray(res.data) ? res.data : [];
        const existing = list.find((o: any) => {
          const oId = o._id || o.id;
          const reqId = typeof o.requestId === "object" ? (o.requestId._id || o.requestId.id) : o.requestId;
          return (offerId && oId === offerId) || reqId === requestId;
        });

        if (existing) {
          let titlePart = "";
          let descPart = existing.description || "";
          if (descPart.includes(" — ")) {
            const parts = descPart.split(" — ");
            titlePart = parts[0];
            descPart = parts.slice(1).join(" — ");
          }

          const existingImgs = Array.isArray(existing.images)
            ? existing.images.map((img: any) => (typeof img === "string" ? img : img.url))
            : [];

          setForm({
            offerTitle: titlePart,
            price: existing.price || 0,
            deliveryTime: existing.deliveryNote || "",
            condition: existing.condition || "new",
            description: descPart,
            images: existingImgs,
            pickupLocation: "",
            deliveryArea: "",
          });
        }
      } catch (e) {
        console.error("Failed to load existing offer:", e);
      }
    }

    loadExistingOffer();
  }, [requestId, offerId]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateField = (field: keyof OfferFormState, value: any) => {
    setErrorMessage(null);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    mutate(form, {
      onSuccess: () => router.push("/dashboard/seller/offers"),
      onError: (err: any) => {
        const msg = err.response?.data?.message || err.message || "عذراً، تعذر تقديم العرض. يرجى المحاولة مرة أخرى.";
        if (msg.includes("3 offers")) {
          setErrorMessage("لقد وصلت للحد الأقصى لتقديم العروض على هذا الطلب (3 عروض نشطة لك على هذا الطلب).");
        } else {
          setErrorMessage(msg);
        }
      },
    });
  };

  return { form, isPending, isEditing: Boolean(offerId), errorMessage, updateField, handleSubmit, back: () => router.back() };
}