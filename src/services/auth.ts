import {apiKits} from "./api.ts"
import router from "../router";

export const authService = {
    setToken(username: string, token: string) {
        if (localStorage.getItem('rememberMe') != null) {
            localStorage.setItem('username', username)
            localStorage.setItem('token', token)
            localStorage.setItem('time', Date.now().toString())
        } else {
            sessionStorage.setItem('username', username)
            sessionStorage.setItem('token', token)
            sessionStorage.setItem('time', Date.now().toString())
        }
    },

    async getToken() {
        const timestamp = localStorage.getItem('time') || sessionStorage.getItem('time')
        const username = localStorage.getItem('username') || sessionStorage.getItem('username')
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')

        if (timestamp == null || username == null || token == null) {
            this.logout()
            router.push("/login")
            return null
        }

        try {
            if ((Date.now() - parseInt(timestamp)) < 1500000) {
                const tokenValid = await this.verify(username, token)

                if (tokenValid) {
                    return token
                }
            }
        } catch (e) {
            this.logout()
            router.push("/login")
            return null
            if (e instanceof Error) {
            } else {
                throw new Error('登录失败')
            }
        }

        const data = await this.update(username, token)

        return data.token
    },

    getCurrentToken() {
        const timestamp = localStorage.getItem('time') || sessionStorage.getItem('time')
        const username = localStorage.getItem('username') || sessionStorage.getItem('username')
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')

        if (timestamp == null || username == null || token == null) {
            this.logout()
            router.push("/login")
            return null
        }

        if ((Date.now() - parseInt(timestamp)) > 1500000) {
            this.logout()
            router.push("/login")
            return null
        }

        return token
    },

    getUsername() {
        return localStorage.getItem('username') || sessionStorage.getItem('username') || 'unknow'
    },


    async login(username: string, password: string) {
        try {
            const data = await apiKits.post("auth", "login", {
                username,
                password
            })

            if (data.token != null) {
                this.setToken(username, data.token)
            }

            return data
        } catch (e) {
            if (e instanceof Error) {
            } else {
                throw new Error('未知错误')
            }
        }
    },

    async register(username: string, password: string) {
        try {
            const data = await apiKits.post("auth", "register", {
                username,
                password
            })

            if (data.token != null) {
                this.setToken(username, data.token)
            }

            return data
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message)
            } else {
                throw new Error('注册失败')
            }
        }
    },

    async changePassword(username: string, newPassword: string) {
        try {
            const token = await this.getToken();
            if (!token) {
                throw new Error('未登录');
            }

            return await apiKits.post("auth", "changePassword", {
                username: username,
                password: newPassword,
                token: token
            });
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message);
            } else {
                throw new Error('修改密码失败');
            }
        }
    },

    async update(username: string, token: string) {
        try {
            const data = await apiKits.post("auth", "update", {
                username,
                token
            })

            if (data.token != null) {
                this.setToken(username, data.token)
            }

            return data
        } catch (e) {
            this.logout()
            router.push("/login")
            if (e instanceof Error) {
                throw new Error(e.message)
            } else {
                throw new Error('登录失败')
            }
        }
    },

    async verify(username: string, token: string) {
        try {
            const data = await apiKits.post("auth", "verify", {
                username,
                token
            })

            return data.isValid
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message)
            } else {
                throw new Error('登录失败')
            }
        }
    },

    logout() {
        sessionStorage.clear()
        localStorage.clear()
    }
}
