import { autoinject } from 'aurelia-framework';
import { UserService } from '../../resources/user-service'
import { CoffeeService } from '../../resources/coffee-service';
import { MachineService } from '../../resources/machine-service';
import { MeasurementService } from '../../resources/measurement-service';

@autoinject
export class Profile {
    private heading = 'Your profile';
    private points = [];
    private allUsers: string;
    private users = [];
    private singleUser;


    constructor(private coffeeService: CoffeeService,
                private machineService: MachineService,
                private measurementService: MeasurementService,
                private userService: UserService) { }

    private getAllUsers(): void {
        this.userService.getUsers()
            .then(response => response.json())
            .then(listOfUsers => {
                this.allUsers = 'All users: ' + Object.keys(listOfUsers).length;
                this.users = listOfUsers;
                console.log('Returned list of users:' + listOfUsers);
            })
            .catch(error => {
                console.log('Error getting list of users!');
            });
    }

    private getUser(userId): void {
        this.userService.getUser(userId)
            .then(response => response.text())
            .then(user => {
                this.singleUser = user;
            });
    }

}
