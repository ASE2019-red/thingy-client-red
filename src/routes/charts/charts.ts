import {AureliaConfiguration} from 'aurelia-configuration';
import {autoinject, observable} from 'aurelia-framework';
import {ValidationController, ValidationControllerFactory, ValidationRules} from 'aurelia-validation';
import * as Chart from 'chart.js';

import * as moment from 'moment';
import {BootstrapFormRenderer} from '../../resources/validation/bootstrap-form-renderer';

@autoinject
export class Charts {
    private controller: ValidationController = null;
    private chartEl: HTMLCanvasElement;
    private chart: Chart;

    // TODO: Validation
    @observable
    private offset: string;

    constructor(validationControllerFactory: ValidationControllerFactory,
                protected config: AureliaConfiguration,
                private maxTicks: number) {

        this.controller = validationControllerFactory.createForCurrentScope();
        this.controller.addRenderer(new BootstrapFormRenderer());

        const rules = ValidationRules
            .ensure('name')
            .required()
            .rules;

        this.controller.addObject(this, rules);
        this.offset = '5m';
    }

    public offsetChanged(newValue, oldValue) {
        console.log('offset changed.');
        const ws = new WebSocket(`ws://${this.config.get('api.host')}/measurements/live/gravity?offset=${this.offset}`);

        ws.addEventListener('message', event => {
            const data = JSON.parse(event.data);
            const timeData = data.map(x => x.time);
            const sumX = data.map(x => x.sum_x);
            const sumY = data.map(x => x.sum_y);
            const sumZ = data.map(x => x.sum_z);

            this.chart.data.labels = timeData;
            this.chart.data.datasets[0].data = sumX;
            this.chart.data.datasets[1].data = sumY;
            this.chart.data.datasets[2].data = sumZ;
            this.updateScale();
        });
    }

    public attached() {

        this.maxTicks = 8;
        this.chart = new Chart(this.chartEl, {
            type: 'line',
            options: {
                hover: {
                    mode: 'label',
                },
                spanGaps: false,
                scales: {
                    xAxes: [{
                        display: true,
                        type: 'time',
                        time: {
                            unit: 'minute',
                            // min: minDate,
                            // max: maxDate,
                            displayFormats: {
                                hour: 'HH',
                                minute: 'HH:mm',
                                second: 'HH:mm:ss',
                            },
                            parser: (date) => {
                                return moment(date).utcOffset('+0100');
                            },
                        },
                        scaleLabel: {
                            display: true,
                        },
                    }],
                },
                plugins: {
                    colorschemes: {
                        scheme: 'office.Essential6',
                    },
                },
            },
            data: {
                datasets: [
                    {label: 'x', data: []},
                    {label: 'y', data: []},
                    {label: 'z', data: []},
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

    public validate(): Promise<boolean> {
        return this.controller.validate().then(result => result.valid);
    }

    private submit() {
        this.validate();
    }
}
