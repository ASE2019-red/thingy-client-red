import { singleton } from 'aurelia-framework';
import { Service } from './service';
import { json } from 'aurelia-fetch-client';

@singleton()
export class UserService extends Service {
    private static readonly ENDPOINT = 'user';
    private static readonly LOGIN_ENDPOINT = 'login';

    public getUsers(): Promise<Response> {
        return this.http.fetch(UserService.ENDPOINT);
    }

     public getUser(userId: string): Promise<Response> {
        const resource = `${UserService.ENDPOINT}/${userId}`;
        return this.http.fetch(resource);
    }

/*    public registerUser(email: string, password: string){

    } */

    public loginUser(email: string, password: string) {
        const resource = UserService.LOGIN_ENDPOINT;

        let jsonData = {}
        jsonData['email'] = email;
        jsonData['psw'] = password;

        return this.http.fetch(resource, {
            method: 'post',
            body: json(jsonData)
          });
    }

}
