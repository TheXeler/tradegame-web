import { apiKits } from "../api.ts";

export const marketService = {
  async getMaterialList() {
    return await apiKits.emptyGet("market", "getMaterialList");
  },

  async getStockList() {
    return await apiKits.emptyGet("market", "getStockList");
  },

  async getDayStockInfo(companyId: number) {
    return await apiKits.get("market", "getDayStockInfo", {
      companyId: companyId
    });
  },

  async getWeekStockInfo(companyId: number) {
    return await apiKits.get("market", "getWeekStockInfo", {
      companyId: companyId
    });
  },

  async getDayMaterialInfo(materialType: string) {
    return await apiKits.get("market", "getDayMaterialInfo", {
      materialType: materialType
    });
  },

  async getWeekMaterialInfo(materialType: string) {
    return await apiKits.get("market", "getWeekMaterialInfo", {
      materialType: materialType
    });
  }
};
