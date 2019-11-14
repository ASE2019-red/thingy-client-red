import { autoinject } from 'aurelia-framework';
import { MeasurementService } from 'resources/measurement-service';

@autoinject
export class Measurement {
    private points = [];

    constructor(private measurementService: MeasurementService) { }

    private getDataPoints(): void {
        this.measurementService.getSeries('gravity')
            .then(response => response.json())
            .then(points => {
                this.points = points;
            });
    }
}
