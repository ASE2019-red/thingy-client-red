import {AureliaConfiguration} from 'aurelia-configuration';
import {autoinject} from 'aurelia-framework';
import * as Chart from 'chart.js';
import * as moment from 'moment';
import {NotificationService} from '../../resources/notification-service';

@autoinject
export class Charts {
    private heading = 'Charts';

    private chartEl: HTMLCanvasElement;
    private chart: Chart;

    constructor(private notificationService: NotificationService,
                protected config: AureliaConfiguration,
                private maxTicks: number) {
    }

    public attached() {
        const ws = new WebSocket(`ws://${this.config.get('api.host')}`);

        ws.addEventListener('message', event => {
            console.log(event.data);
            this.addData(moment().unix(), event.data);
            this.updateScale();
        });

        this.maxTicks = 8;
        this.chart = new Chart(this.chartEl, {
            type: 'line',
            options: {
                hover: {
                    mode: 'label',
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                        },
                    }],
                },
            },
            data: {
                datasets: [
                    {label: 'line', data: []},
                ],
            },

        });
    }

    public addData(label, data) {
        this.chart.data.labels.push(label);
        this.chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });

        if (this.maxTicks > 0 && this.chart.data.labels.length > this.maxTicks) {
            this.chart.data.labels.shift();
            this.chart.data.datasets.forEach((dataset) => {
                dataset.data[0] = dataset.data[1];
                dataset.data.splice(1, 1);
            });

        }
        this.chart.update();
    }

    public updateScale() {
        this.chart.options.scales.yAxes[0] = {
            type: 'linear',
        };
        this.chart.update();
    }
}
