import { IAccount, ISessionToken, TokenGenerator, TokenRights, TokenState, TokenValidator } from "../Server/Model";
import { logInvocation } from "../Shared/MethodDecorators";
import { countInstances } from "../Shared/ObjectsCounter";
import { SessionTokenDBAccess } from "./SessionTokenDBAccess";
import { UserCredentialsDBAccess } from "./UserCredentialsDBAccess";

@countInstances
export class Authorizer implements TokenGenerator, TokenValidator {

    private userCreateDBAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess()
    private sessionTokenDBAccess: SessionTokenDBAccess = new SessionTokenDBAccess()

    @logInvocation
    async generateToken(account: IAccount): Promise<ISessionToken | undefined> {
        const resultAccount = await this.userCreateDBAccess.getUserCredential(account.username, account.password)

        if (resultAccount) {
            const token: ISessionToken = {
                accessRights: resultAccount.accessRights,
                username: resultAccount.username,
                expirationTime: this.generateExpirationTime(),
                valid: true,
                tokenId: this.generateRandomTokenId()
            }

            await this.sessionTokenDBAccess.storeSessionToken(token)
            return token
            
        } else {
            return undefined
        }
    }

    public async validateToken(tokenId: string): Promise<TokenRights> {
        const token = await this.sessionTokenDBAccess.getToken(tokenId)
        
        if (!token || !token.valid) {
            return {
                accessRights: [],
                state: TokenState.INVALID
            }
        } else if (token.expirationTime < new Date()) {
            return {
                accessRights: [],
                state: TokenState.EXPIRED
            }
        } else {
            return {
                accessRights: token.accessRights,
                state: TokenState.VALID
            }
        }
    }

    private generateRandomTokenId() {
        return Math.random().toString(36).slice(2)
    }

    private generateExpirationTime() {
        return new Date(Date.now() + 60 * 60 * 1000)
    }
    
}