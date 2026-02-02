import { useState, useCallback } from "react";
import { db, collection, getDocs, query, where } from "@/firebaseConfig";

interface LotteryResult {
  id: string;
  lotteryName: string;
  drawNumber: string;
  drawDate: string;
  drawTime: string;
  location: string;
  prizes: Record<string, unknown>;
}

interface CachedLotteryData {
  date: string;
  lotteries: LotteryResult[];
  timestamp: number;
  hasData: boolean;
}

const CACHE_KEY_PREFIX = "lottery_cache_";
const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours

/**
 * Custom hook for caching lottery data by date
 */
export function useLotteryCache() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get cached data for a specific date
   */
  const getCachedData = useCallback(
    (date: string): CachedLotteryData | null => {
      try {
        const cacheKey = `${CACHE_KEY_PREFIX}${date}`;
        const cached = localStorage.getItem(cacheKey);

        if (!cached) return null;

        const data: CachedLotteryData = JSON.parse(cached);

        // Check if cache is still valid
        const now = Date.now();
        if (now - data.timestamp > CACHE_DURATION) {
          localStorage.removeItem(cacheKey);
          return null;
        }

        return data;
      } catch (err) {
        console.error("Error reading cache:", err);
        return null;
      }
    },
    [],
  );

  /**
   * Cache lottery data for a specific date
   */
  const cacheData = useCallback((date: string, lotteries: LotteryResult[]) => {
    try {
      const cacheKey = `${CACHE_KEY_PREFIX}${date}`;
      const data: CachedLotteryData = {
        date,
        lotteries,
        timestamp: Date.now(),
        hasData: lotteries.length > 0,
      };

      localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (err) {
      console.error("Error caching data:", err);
    }
  }, []);

  /**
   * Fetch lottery data by date (with caching)
   */
  const fetchByDate = useCallback(
    async (date: string): Promise<LotteryResult[]> => {
      // Check cache first
      const cached = getCachedData(date);
      if (cached) {
        return cached.lotteries;
      }

      // Fetch from Firestore
      setLoading(true);
      setError(null);

      try {
        const lotteriesRef = collection(db, "lottery_results");
        const q = query(lotteriesRef, where("drawDate", "==", date));
        const snapshot = await getDocs(q);

        const lotteries: LotteryResult[] = snapshot.docs.map((doc) => {
          const data = doc.data() as Record<string, unknown>;
          return {
            id: doc.id,
            lotteryName: String(data.lotteryName || data.lottery || ""),
            drawNumber: String(data.drawNumber || ""),
            drawDate: String(data.drawDate || ""),
            drawTime: String(data.drawTime || ""),
            location: String(data.location || ""),
            prizes: data.prizes as Record<string, unknown>,
          };
        });

        // Cache the result
        cacheData(date, lotteries);

        return lotteries;
      } catch (err) {
        console.error("Error fetching lotteries:", err);
        setError("Failed to fetch lottery data. Please try again.");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [getCachedData, cacheData],
  );

  /**
   * Clear cache for a specific date
   */
  const clearCache = useCallback((date: string) => {
    const cacheKey = `${CACHE_KEY_PREFIX}${date}`;
    localStorage.removeItem(cacheKey);
  }, []);

  /**
   * Clear all lottery cache
   */
  const clearAllCache = useCallback(() => {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }, []);

  return {
    loading,
    error,
    fetchByDate,
    getCachedData,
    clearCache,
    clearAllCache,
  };
}
