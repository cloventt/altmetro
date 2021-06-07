import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MetroinfoApiService } from '../metroinfo-api.service';
import { StoredConfigService } from '../stored-config.service';

@Component({
  selector: 'app-add-bus-tile',
  templateUrl: './add-bus-tile.component.html',
  styleUrls: ['./add-bus-tile.component.scss']
})
export class AddBusTileComponent implements OnInit {

  addStopForm: FormGroup;

  formStyle = '';
  formError = '';

  constructor(
    private formBuilder: FormBuilder,
    private appConfigService: StoredConfigService,
    private metroinfoApi: MetroinfoApiService) { }

  ngOnInit(): void {
    this.addStopForm = this.formBuilder.group({
      stopNumber: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.formStyle = '';
    this.formError = '';
    const stopNumber = +this.addStopForm.value.stopNumber;
    if (!stopNumber) {
      this.onFormError(new Error('You must provide a valid stop number.'));
      return;
    }
    const config = this.appConfigService.get();
    this.metroinfoApi.getPlatformData(stopNumber).subscribe({
      next: (data) => {
        if (data !== null) {
          config.savedStops.push(data);
          this.appConfigService.update(config);
        } else {
          this.onFormError(new Error('That stop does not exist, check the number and try again.'));
        }
      },
    });
  }

  onFormError(err: Error): void {
    this.formStyle = 'is-danger';
    this.formError = err.message;
  }

}
