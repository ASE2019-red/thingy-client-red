import { AureliaConfiguration } from 'aurelia-configuration';
import { autoinject } from 'aurelia-framework';

@autoinject
export class MachineCalibration {
    public id: string;
    public starting: boolean = false;
    public calibrating: boolean = false;
    public isSuccess = true;
    public btnMsgNorm = 'Start Calibration';
    public btnMsgStarting = 'Starting...';
    public btnMsg = this.btnMsgNorm;
    public ws: WebSocket;
    public limit: number = 30;
    public currentProgress: number = 0;
    public progressPercent: number = 0;
    public progressInterval;
    public alert = {
        show: false,
        level: 'warning',
        text: ''
    };
    public success = {
        show: false,
        text: 'Calibration successfully finished.'
    };

    constructor(private config: AureliaConfiguration) {}

    public activate(params, routeConfig, navigationInstruction) {
        this.id = params.id;
    }

    public deactivate() {
        this.reset();
        if (!!this.ws) {
            this.ws.close();
        }
    }

    public start() {
        this.starting = true;
        this.btnMsg = this.btnMsgStarting;
        this.ws = new WebSocket(`ws://${this.config.get('api.host')}/machine/calibration`);

        this.ws.addEventListener('open', event => {
            const data = { id: this.id };
            this.ws.send(JSON.stringify(data));
            this.alert.show = false;
        });

        this.ws.addEventListener('message', event => {
            const data = JSON.parse(event.data);
            if (data['calibrating'] === true) {
                this.starting = false;
                this.calibrating = true;
                this.limit = data['limit'];

                this.progressInterval = setInterval(this.progress.bind(this), 1000);
            }
            console.log(`Notification received: ${event.data}`);
        });
        this.ws.addEventListener('error', event => {
            this.reset();
            this.alert.level = 'danger';
            this.alert.text = 'An error was encountered. Calibration has been aborted.';
            this.alert.show = true;
        });
        this.ws.addEventListener('close', event => {
            if (event.code === 1000 && event.reason === 'timeout') {
                this.reset();
                this.success.text = 'Maximal duration reached. Calibration has been completed by the server.';
                this.success.show = true;
            } else if (event.reason === 'user-cancel') {
                this.reset();
                this.alert.level = 'warning';
                this.alert.text = 'Calibration has been aborted.';
                this.alert.show = true;
            } else if (event.reason === 'finish') {
                this.reset();
                this.success.show = true;
            } else {
                this.reset();
                this.alert.level = 'danger';
                this.alert.text = 'Calibration has been aborted by the server.';
                this.alert.show = true;
            }
        });
    }

    private progress() {
        if (this.currentProgress < this.limit) {
            this.currentProgress++;
            this.progressPercent = (100 / this.limit) * this.currentProgress;
        }
    }

    private abort() {
        if (!!this.ws) {
            this.ws.close(1000, 'user-cancel');
        }
    }

    private finish() {
        if (!!this.ws) {
            this.ws.close(1000, 'finish');
        }
    }

    private reset() {
        this.starting = false;
        this.calibrating = false;
        this.currentProgress = 0;
        this.btnMsg = this.btnMsgNorm;
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
    }

}
