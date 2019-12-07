import { autoinject } from 'aurelia-framework';
import { CoffeeService } from 'resources/coffee-service';
import { MachineService } from 'resources/machine-service';
import { MeasurementService } from 'resources/measurement-service';
import * as Chart from 'chart.js';
import * as moment from 'moment';
import { labeledStatement } from '@babel/types';

@autoinject
export class CoffeeCounter {
    private heading = 'Coffee Counter';
    private allCoffees: string;
    private allCoffeesOfSpecificMachine: string;
    private machines;
    private points = [];
    private chartEl: HTMLCanvasElement;
    private chart: Chart;
    private data: Chart.ChartData;

    constructor(private coffeeService: CoffeeService,
        private machineService: MachineService,
        private measurementService: MeasurementService) {
        this.coffeeService.getAll().then(response => response.json())
            .then(coffees => {
                this.data = this.generateData(coffees);
            });
    }

    public generateData(coffees) {
        const today = moment();
        const dateLabels = [];
        const coffeeCount = Array(7).fill(0);
        const aWeekAgo = moment(today).subtract(6, "days");
        for (const m = moment(aWeekAgo); m.isSameOrBefore(today); m.add(1, 'days')) {
            dateLabels.push(m.format('DD.M'));
        }
        coffees.forEach(c => {
            const daysDifference = moment(c.createdAt).diff(today, 'days');
            if (daysDifference >= -6) {
                coffeeCount[daysDifference + 6] = coffeeCount[daysDifference + 6] + 1;
            }
        });
        return {
            labels: dateLabels,
            datasets: [{
                label: 'Coffees consumed',
                data: coffeeCount,
            }],
        };

    }

    public attached() {
        this.chart = new Chart(this.chartEl, {
            type: 'bar',
            options: {
                hover: {
                    mode: 'label',
                },
                spanGaps: false,
                scales: {
                    xAxes: [{
                        display: true,
                    }],
                },
                plugins: {
                    colorschemes: {
                        scheme: 'office.Essential6',
                    },
                },
            },
            data: this.data,
        });
    }

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
}
