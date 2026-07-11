import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tag, MessageSquare, Loader2, Eye } from "lucide-react";
import axiosInstance from "@/shared/APIs/axiosInstance";
import { OfferDetailsModal } from "@/shared/components/OfferDetailsModal";

export function RecentOffersCard({ offer }: { offer: any }) {
  const router = useRouter();
  const [loadingChat, setLoadingChat] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const reqData = typeof offer.requestId === "object" ? offer.requestId : null;
  const requestTitle = reqData?.rawText?.slice(0, 50) || "";
  const title = offer.title || offer.description || requestTitle || "Offer";

  const sellerObj = typeof offer.sellerId === "object" ? offer.sellerId : null;
  const sellerName = offer.seller || sellerObj?.name || "Seller";
  const firstImg = Array.isArray(offer.images) && offer.images.length > 0 ? offer.images[0] : null;
  const productImg = firstImg ? (typeof firstImg === "string" ? firstImg : firstImg?.url || "") : (offer.imageURL || offer.imageUrl || "");
  const imageUrl = productImg || sellerObj?.profileImage || "";
  const price = offer.price ?? 0;
  const hasValidImage = imageUrl && !imageUrl.includes("placeholder") && imageUrl.trim() !== "";

  const handleStartChat = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const sellerId = sellerObj?._id || (typeof offer.sellerId === "string" ? offer.sellerId : null);
    const requestId = reqData?._id || (typeof offer.requestId === "string" ? offer.requestId : null);

    if (!sellerId || !requestId) {
      router.push("/dashboard/chat");
      return;
    }

    try {
      setLoadingChat(true);
      const res = await axiosInstance.post("/chat", {
        requestId,
        sellerId,
        offerId: offer._id,
      });
      const convData = res.data?.data || res.data;
      const convId = convData?._id || convData?.id;

      if (convId) {
        router.push(`/dashboard/chat?conversationId=${convId}`);
      } else {
        router.push("/dashboard/chat");
      }
    } catch (err) {
      console.error("Failed to start conversation:", err);
      router.push("/dashboard/chat");
    } finally {
      setLoadingChat(false);
    }
  };

  return (
    <>
      <div
        onClick={() => setIsDetailsOpen(true)}
        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-200 last:border-b-0 gap-3 cursor-pointer group"
      >
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-indigo-950/40 flex items-center justify-center shrink-0 border border-slate-200 dark:border-indigo-500/30 overflow-hidden group-hover:scale-105 transition-transform">
            {hasValidImage ? (
              <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <Tag className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            )}
          </div>
          <div className="min-w-0 space-y-0.5">
            <h6 className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-[#fff4b7] transition-colors">
              {title}
            </h6>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
              {sellerName} {requestTitle ? `· For: "${requestTitle}"` : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          <p className="text-sm font-extrabold text-blue-600 dark:text-cyan-300">
            {price.toLocaleString()} EGP
          </p>
          
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsDetailsOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
            title="معاينة العرض"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>عرض</span>
          </button>

          <button
            type="button"
            onClick={handleStartChat}
            disabled={loadingChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-white bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-cyan-300 border border-blue-500/20 rounded-xl transition-all cursor-pointer"
          >
            {loadingChat ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MessageSquare className="w-3.5 h-3.5" />}
            <span>Chat</span>
          </button>
        </div>
      </div>

      <OfferDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        offer={offer}
      />
    </>
  );
}