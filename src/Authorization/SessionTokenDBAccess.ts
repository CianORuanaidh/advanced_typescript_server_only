import * as Nedb from 'nedb'
import { ISessionToken } from '../Server/Model';
import { logInvocation } from '../Shared/MethodDecorators';

export class SessionTokenDBAccess {

    private nedb: Nedb;

    constructor() {
        this.nedb = new Nedb('database/SessionToken.db')
        this.nedb.loadDatabase()
    }

    @logInvocation
    public async storeSessionToken(token: ISessionToken): Promise<void> {
        return new Promise((resolve, reject) => {
            this.nedb.insert(token, (err: Error | null, docs: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(docs)
                }
            })
        })
    }

    @logInvocation
    public async getToken(tokenId: string): Promise<ISessionToken | undefined> {
        return new Promise((reslove, reject) => {
            this.nedb.find({tokenId: tokenId}, (err: Error, docs: any[]) => {
                if (err) {
                    reject(err)
                } else {
                    if (docs.length === 0) {
                        reslove(undefined)
                    } else {
                        reslove(docs[0])
                    }
                }
            })
        })
    }
}