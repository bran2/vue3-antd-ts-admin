import service from './request'
import {LoginRes} from '@/model/sys.model'
import {RentOrder, RentParams} from "@/services/data";

export const loginAsync = async (username: string, password: string) => {
    return service.post<LoginRes>('auth/login', {
        username: username,
        password: password,
    })
}

/**
 * 获取租金列表
 */
export const getRentList = async (rentParams: RentParams) => {
    return service.post<RentOrder>('rentList/list', rentParams)
}
