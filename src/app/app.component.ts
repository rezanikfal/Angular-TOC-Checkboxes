import { HttpHeaders } from '@angular/common/http';
import { Input, Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { GlobalCartesianDataService } from '../app/global-cartesian-data.service';

interface ILayersInformation {
  description: string;
  active?: boolean;
  parentIndex?: number;
}

interface IFeatureData extends ILayersInformation {
  visible: boolean;
  checked: boolean;
  StructureTypeId: number;
  StructureTypeIndex: number;
  DataPointTypeId: number;
  DataPointTypeIndex: number;
  SubStructureId: number;
  SubStructureIndex: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  StructureTypeInfo: ILayersInformation[] = [];
  dataPointInfo: ILayersInformation[] = [];
  SubStructureInfo: IFeatureData[] = [];

  constructor(
    private cartesianData: GlobalCartesianDataService,
    private fb: FormBuilder
  ) {}

  allLayers = new FormGroup({
    StructureTypesArray: this.fb.array([]),
  });

  allStructures = new FormGroup({
    DataPointsArray: this.fb.array([]),
  });

  allDataPoints = new FormGroup({
    SubStructuresArray: this.fb.array([]),
  });

  get StructureTypeArray() {
    return this.allLayers.get('StructureTypesArray') as FormArray;
  }

  get DataPointArray() {
    return this.allStructures.get('DataPointsArray') as FormArray;
  }

  get SubStructureTypeArray() {
    return this.allDataPoints.get('SubStructuresArray') as FormArray;
  }

  ngOnInit(): void {
    this.cartesianData.layersInfo().subscribe((layers) => {
      layers.forEach((SType: any) => {
        this.StructureTypeArray.push(this.fb.control(false));
        this.StructureTypeInfo.push({
          description: SType.Description,
          active: false,
        });
        SType.DataPointTypes.forEach((DataType: any) => {
          this.DataPointArray.push(this.fb.control(false));
          this.dataPointInfo.push({
            description: DataType.Description,
            active: false,
            parentIndex: this.StructureTypeInfo.length - 1,
          });
          DataType.SubStructures.forEach((SubStructureType: any) => {
            this.SubStructureTypeArray.push(this.fb.control(false));
            this.SubStructureInfo.push({
              description: SubStructureType.Description,
              visible: false,
              checked: SubStructureType.Layer.Active,
              StructureTypeId: SType.StructureTypeId,
              StructureTypeIndex: this.StructureTypeInfo.length - 1,
              DataPointTypeId: DataType.DataPointTypeId,
              DataPointTypeIndex: this.dataPointInfo.length - 1,
              SubStructureId: SubStructureType.SubStructureId,
              SubStructureIndex: this.SubStructureInfo.length, //The index for the array itself (before adding the new element)
            });
          });
        });
      });

      this.SubStructureInfo.forEach((SubStr) => {
        if (SubStr.checked) {
          this.StructureTypeArray.get(
            String(SubStr.StructureTypeIndex)
          ).setValue(true);
          this.StructureTypeInfo[SubStr.StructureTypeIndex].active = true;
          this.DataPointArray.get(String(SubStr.DataPointTypeIndex)).setValue(
            true
          );
          this.dataPointInfo[SubStr.DataPointTypeIndex].active = true;
          this.SubStructureTypeArray.get(
            String(SubStr.SubStructureIndex)
          ).setValue(true);
          this.SubStructureInfo[SubStr.SubStructureIndex].visible = true;
        }
      });

      this.allLayers.valueChanges.subscribe(({ StructureTypesArray }) => {
        StructureTypesArray.forEach((e: boolean, i: number) => {
          this.StructureTypeInfo[i].active = e;
        });
        this.updateVisibleLayers();
      });

      this.allStructures.valueChanges.subscribe(({ DataPointsArray }) => {
        DataPointsArray.forEach((e: boolean, i: number) => {
          this.dataPointInfo[i].active = e;
        });
        this.updateVisibleLayers();
      });

      this.allDataPoints.valueChanges.subscribe(({ SubStructuresArray }) => {
        SubStructuresArray.forEach((e: boolean, i: number) => {
          this.SubStructureInfo[i].checked = e;
        });
        this.updateVisibleLayers();
      });
    });
  }

  updateVisibleLayers() {
    this.SubStructureInfo.forEach((SubStr) => {
      SubStr.visible =
        this.StructureTypeInfo[SubStr.StructureTypeIndex].active &&
        this.dataPointInfo[SubStr.DataPointTypeIndex].active &&
        this.SubStructureInfo[SubStr.SubStructureIndex].checked;
    });
  }

  test() {
    this.SubStructureInfo.forEach((AA, i) => {
      console.log(AA, i);
    });
  }
}
