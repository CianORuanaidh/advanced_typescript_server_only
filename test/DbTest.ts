import { UserCredentialsDBAccess } from "../src/Authorization/UserCredentialsDBAccess";
import { AccessRight, IWorkingPosition } from "../src/Shared/Model";
import { UsersDBAccess } from "../src/User/UsersDBAccess";

class DbTest {
    public dbAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess()
    public userAccess: UsersDBAccess = new UsersDBAccess()
}

new DbTest().dbAccess.putUserCredential({
    username: 'user1',
    password: 'password1',
    accessRights: [AccessRight.UPDATE, AccessRight.CREATE, AccessRight.DELETE, AccessRight.READ]
})

// new DbTest().userAccess.putUser({
//     id: '33333',
//     name: 'cian',
//     age: 99,
//     email: 'cian@email.com',
//     workingPosition: IWorkingPosition.PROGRAMER
// })