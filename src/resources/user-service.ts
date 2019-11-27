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
        //return this.http.fetch(UserService.ENDPOINT);
        let jsonData = {}
        jsonData['email'] = email;
        jsonData['psw'] = password;
/*         const formData = new FormData();
        formData.append('email', email);
        formData.append('psw', password); */
        //return this.http.post(resource, jsonData);
        return this.http.fetch(resource, {
            method: 'post',
            body: json(jsonData)
          });
    }

}
