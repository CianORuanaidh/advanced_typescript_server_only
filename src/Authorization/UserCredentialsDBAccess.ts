import { UserCredentials } from "../Shared/Model";
import * as Nedb from 'nedb'
import { throws } from "assert/strict";
import { delayResponse } from "../Shared/MethodDecorators";

export class UserCredentialsDBAccess {

    private nedb: Nedb;

    constructor() {
        this.nedb = new Nedb('database/UserCredentials.db')
        this.nedb.loadDatabase()
    }

    public async putUserCredential(userCredentials: UserCredentials): Promise<any> {
        return new Promise((resolve, reject) => {
            this.nedb.insert(userCredentials, (err: Error | null, docs: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(docs)
                }
            })
        })
    }

    @delayResponse(5000)
    public async getUserCredential(username: string, password: string): Promise<UserCredentials | undefined> {
        // throw ""
        return new Promise((resolve, reject) => {
            this.nedb.find({ username , password }, (err: Error | null, docs: UserCredentials[]) => {
                if (err){
                    reject(err)
                } else {
                    console.log('\n\n\nMETHOD FINISHED\nWHOOOOO\n\n\n')
                    if (docs.length === 0) {
                        resolve(undefined)
                    } else {
                        resolve(docs[0])
                    }
                }

            })
        })
    }

}