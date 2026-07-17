import { useAuth } from "@clerk/nextjs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import type { ApiPackage } from "@/hooks/api/usePackages";

export interface WishlistItem {
  id: string;
  packageId: string;
  package: ApiPackage | null;
  createdAt: string;
}

interface WishlistResponse {
  data: WishlistItem[];
}

export function useWishlist() {
  const queryClient = useQueryClient();
  const { isLoaded, isSignedIn } = useAuth();

  const query = useQuery<WishlistResponse>({
    queryKey: ["wishlist-ids"],
    queryFn: async () => {
      const res = await fetch("/api/wishlist");
      if (res.status === 401) return { data: [] };
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      return res.json() as Promise<WishlistResponse>;
    },
    staleTime: 30_000,
    enabled: isLoaded && isSignedIn === true,
  });

  const mutation = useMutation<
    { wishlisted: boolean },
    Error,
    string,
    { previous: WishlistResponse | undefined }
  >({
    mutationFn: async (packageId) => {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });
      if (!res.ok) throw new Error("Failed to update wishlist");
      return res.json() as Promise<{ wishlisted: boolean }>;
    },
    onMutate: async (packageId) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist-ids"] });
      const previous = queryClient.getQueryData<WishlistResponse>([
        "wishlist-ids",
      ]);
      queryClient.setQueryData<WishlistResponse>(["wishlist-ids"], (old) => {
        const current = old ?? { data: [] };
        const exists = current.data.some((w) => w.packageId === packageId);
        return {
          data: exists
            ? current.data.filter((w) => w.packageId !== packageId)
            : [
                ...current.data,
                {
                  id: `opt_${packageId}`,
                  packageId,
                  package: null,
                  createdAt: new Date().toISOString(),
                },
              ],
        };
      });
      return { previous };
    },
    onError: (_err, _packageId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(["wishlist-ids"], context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["wishlist-ids"] });
    },
  });

  const items = query.data?.data ?? [];
  const ids = items.map((w) => w.packageId);

  return {
    ids,
    packages: items
      .map((w) => w.package)
      .filter((p): p is ApiPackage => p !== null),
    has: (id: string) => ids.includes(id),
    toggle: mutation.mutate,
    isPending: mutation.isPending,
    isLoading: query.isLoading,
  };
}
