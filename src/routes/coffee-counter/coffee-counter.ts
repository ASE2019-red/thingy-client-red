import { autoinject } from 'aurelia-framework';
import { CoffeeService } from 'resources/coffee-service';
import { MachineService } from 'resources/machine-service';
import { MeasurementService } from 'resources/measurement-service';
import * as Chart from 'chart.js';
import * as moment from 'moment';
import { AureliaConfiguration } from 'aurelia-configuration';

type ChartTimeMode = 'day' | 'week' | 'month' | 'year';
@autoinject
export class CoffeeCounter {
    private selectedChartMachine: null | string = null;
    private machines;
    private chartEl: HTMLCanvasElement;
    private chart: Chart;
    private data: Chart.ChartData;
    private producedInSelection = 0;
    private selectedChartTimeMode: ChartTimeMode = 'week';
    private chartTimeModes = [
        { value: 'day', text: 'last 24 hours' },
        { value: 'week', text: 'last 7 days' },
        { value: 'month', text: 'last month' },
        { value: 'year', text: 'last year' },
    ];

    public get consumptionMessage() {
        return `Coffees produced in the ${this.currentModeText} by ${this.currentMachineText}: `;
    }

    public get currentModeText() {
        return this.chartTimeModes.find(m => m.value === this.selectedChartTimeMode).text;
    }

    public get currentMachineText() {
        return this.selectedChartMachine == null ? 'all machines' :
            this.machines.find(m => m.id === this.selectedChartMachine).name;
    }

    constructor(protected config: AureliaConfiguration,
        private coffeeService: CoffeeService,
        private machineService: MachineService,
        private measurementService: MeasurementService) {
        this.refreshChart();
        this.getAllMachines();
    }

    public onSelectedChartTimeModeChange(mode: ChartTimeMode) {
        this.selectedChartTimeMode = mode;
        this.refreshChart();
    }

    public onSelectedChartMachineChanged(machineId: string | null) {
        this.selectedChartMachine = machineId;
        this.refreshChart();
    }

    public refreshChart() {
        const currentChartTimeMode = this.selectedChartTimeMode;
        this.getCoffeesPromise()
            .then(response => response.json())
            .then(coffees => {
                this.data = this.generateChartData(coffees, currentChartTimeMode);
                if (this.chart) {
                    this.chart.data = this.data;
                    this.chart.update();
                }
            });
    }

    public generateChartData(coffees, mode: ChartTimeMode = 'week'): Chart.ChartData {
        const today = moment();
        const dateLabels = [];
        let timeUnit: moment.unitOfTime.DurationConstructor = 'days';
        let timeDifference = 6;
        let timeFormat = 'DD.M';
        switch (mode) {
            case 'day':
                timeUnit = 'hours';
                timeDifference = 23;
                timeFormat = 'HH';
                break;
            case 'week':
                timeUnit = 'days';
                timeDifference = 6;
                timeFormat = 'ddd';
                break;
            case 'month':
                timeUnit = 'days';
                timeDifference = 50;
                timeFormat = 'DD.M';
                break;
            case 'year':
                timeUnit = 'month';
                timeDifference = 11;
                timeFormat = 'MMM';
                break;
        }
        const coffeeCount = Array(timeDifference + 1).fill(0);

        const aWeekAgo = moment(today).subtract(timeDifference, timeUnit);
        for (const m = moment(aWeekAgo); m.isSameOrBefore(today); m.add(1, timeUnit)) {
            dateLabels.push(m.format(timeFormat));
        }
        coffees.forEach(c => {
            const daysDifference = moment(c.createdAt).diff(today, timeUnit);
            if (daysDifference >= -timeDifference) {
                coffeeCount[daysDifference + timeDifference] = coffeeCount[daysDifference + timeDifference] + 1;
            }
        });
        this.producedInSelection = coffeeCount.reduce((sum, curr) => (sum + curr), 0);
        return {
            labels: dateLabels,
            datasets: [{
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                label: 'Coffees consumed',
                data: coffeeCount,
            }],
        };

    }

    public attached() {
        this.generateChart();
        this.connectWebsocket();
    }

    private generateChart() {
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
                        ticks: {
                            min: 0,
                            stepSize: 1,
                        },
                    }],
                    yAxes: [
                        {
                            // typing seems to be wrong here,
                            // thus we need to cast it to any to ignore it
                            // it seems to work as appropriate,
                            // we only get integer ticks with it
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                                min: 0,
                            } as any,
                        },
                    ],
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

    private connectWebsocket() {
        const ws = new WebSocket(`ws://${this.config.get('api.host')}/notifications`);

        ws.addEventListener('message', event => {
            this.refreshChart();
        });
    }

    private getCoffeesPromise() {
        if (this.selectedChartMachine == null) {
            return this.coffeeService.getAll();
        }
        return this.machineService.getCoffees(this.selectedChartMachine);
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
