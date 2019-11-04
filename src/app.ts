import { autoinject } from 'aurelia-framework';
import { CoffeeService } from 'resources/coffee-service';
import { MachineService } from 'resources/machine-service';

@autoinject
export class App {
    private heading = 'Coffee Counter';
    private message: string = 'Welcome to the coffee counter! Current coffees: ';
    private coffeeCounter = 0;

    constructor(private coffeeService: CoffeeService, private machineService: MachineService) {}

    private getAllCoffees(): void {
        this.message = 'All coffees:';
        this.coffeeService.getAll()
            .then(response => response.json())
            .then(listOfCoffees => {
                this.coffeeCounter = Object.keys(listOfCoffees).length;
                console.log('Returned list of coffees:' + listOfCoffees);
            })
            .catch(error => {
                console.log('Error getting list of coffees!');
                this.coffeeCounter = 5;
            });
    }

    private getAllCoffeesOfMachine(machineId): void {
        this.message = 'All coffees of machine ' + machineId + ':';
        this.machineService.getCoffeeCount(machineId)
            .then(response => response.text())
            .then(text => {
                this.coffeeCounter = parseInt(text);
            });
    }

}
