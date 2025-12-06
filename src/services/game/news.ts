import {apiKits} from "../api.ts"

export const newsGameService = {
    async getNewsList() {
        const data = await apiKits.emptyGet("news", "getList")

        sessionStorage.setItem('news.list', JSON.stringify(data))
    },

    async getNewsInfo(newsId: number) {
        const data = await apiKits.get("news", "getInfo", {id: newsId})

        sessionStorage.setItem(`news.${newsId}.info`, JSON.stringify(data))
    }
}
