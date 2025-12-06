import {apiKits} from "../api.ts"
import {authService} from "../auth.ts"

export const userGameService = {
    async updateAllUserData(username: string) {
        console.log("break point for ", this)
        this.setValid(false)

        const token = await authService.getToken()
        const data = await apiKits.post("user", "getAllGameValue", {
            token: token,
            username: username
        })

        sessionStorage.setItem('user.balance', data.balance)
        sessionStorage.setItem('user.laborPoints', data.laborPoints)
        sessionStorage.setItem('user.factionCash', data.factionCash)
        sessionStorage.setItem('user.hardwareMaterials', data.hardwareMaterials)
        sessionStorage.setItem('user.buildingMaterials', data.buildingMaterials)
        sessionStorage.setItem('user.electricalMaterials', data.electricalMaterials)
        sessionStorage.setItem('user.chemicalMaterials', data.chemicalMaterials)

        this.setValid(true)
    },

    async updateUserData(username: string, type: string) {
        this.setValid(false)

        const token = await authService.getToken()
        const data = await apiKits.post("user", "getGameValue", {
            token: token,
            username: username,
            type: type
        })

        sessionStorage.setItem(`user.${type}`, data.value)

        this.setValid(true)
    },

    async updateUserBalance(username: string) {
        await this.updateUserData(username, "balance")
    },

    async updateUserLaborPoints(username: string) {
        await this.updateUserData(username, "laborPoints")
    },

    async updateUserFactionCash(username: string) {
        await this.updateUserData(username, "factionCash")
    },

    async updateUserHardwareMaterials(username: string) {
        await this.updateUserData(username, "hardwareMaterials")
    },

    async updateUserBuildingMaterials(username: string) {
        await this.updateUserData(username, "buildingMaterials")
    },

    async updateUserElectricalMaterials(username: string) {
        await this.updateUserData(username, "electricalMaterials")
    },

    async updateUserChemicalMaterials(username: string) {
        await this.updateUserData(username, "chemicalMaterials")
    },

    setValid(valid: boolean) {
        sessionStorage.setItem('user.valid', valid.toString())
    },

    isValid() {
        return sessionStorage.getItem('user.valid') != null
    },

    getBalance() {
        return sessionStorage.getItem('user.balance') || '0'
    },

    getLaborPoints() {
        return sessionStorage.getItem('user.laborPoints') || '0'
    },

    getFactionCash() {
        return sessionStorage.getItem('user.factionCash') || '0'
    },

    getHardwareMaterials() {
        return sessionStorage.getItem('user.hardwareMaterials') || '0'
    },

    getBuildingMaterials() {
        return sessionStorage.getItem('user.buildingMaterials') || '0'
    },

    getElectricalMaterials() {
        return sessionStorage.getItem('user.electricalMaterials') || '0'
    },

    getChemicalMaterials() {
        return sessionStorage.getItem('user.chemicalMaterials') || '0'
    },

    async changeUserData(username: string, type: string, amount: number) {
        let data = {
            token: await authService.getToken(),
            username: username,
            amount: amount
        }

        switch (type) {
            case "set":
                data.amount = amount
        }

        return await apiKits.post("user", "setGameValue", data)
    }
}
