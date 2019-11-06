import { autoinject } from 'aurelia-framework';
import { CoffeeService } from 'resources/coffee-service';
import { MachineService } from 'resources/machine-service';
import { MeasurementService } from 'resources/measurement-service';

@autoinject
export class App {
    private heading = 'Coffee Counter';
    private allCoffees: string;
    private allCoffeesOfSpecificMachine: string;
    private machines;
    private points = [];

    constructor(private coffeeService: CoffeeService,
                private machineService: MachineService,
                private measurementService: MeasurementService) {}

    private getAllCoffees(): void {
        this.coffeeService.getAll()
            .then(response => response.json())
            .then(listOfCoffees => {
                this.allCoffees = 'All coffees: ' + Object.keys(listOfCoffees).length;
                console.log('Returned list of coffees:' + listOfCoffees);
            })
            .catch(error => {
                console.log('Error getting list of coffees!');
            });
    }

    private getAllCoffeesOfMachine(machineId): void {
        this.machineService.getCoffeeCount(machineId)
            .then(response => response.text())
            .then(text => {
                this.allCoffeesOfSpecificMachine = 'All coffees of machine ' + machineId + ': ' + parseInt(text);
            });
    }

    private getAllMachines(): void {
        this.machineService.getAll()
            .then(response => response.json())
            .then(listOfMachines => {
                this.machines = listOfMachines;
                console.log('Returned list of machines:' + listOfMachines);
            })
            .catch(error => {
                console.log('Error getting list of machines!');
            });
    }

    private getDataPoints(): void {
        this.measurementService.getSeries('gravity')
            .then(response => response.json())
            .then(points => {
                this.points = points;
            });
    }

}
