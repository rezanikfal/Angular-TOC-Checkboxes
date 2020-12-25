import { HttpHeaders } from '@angular/common/http';
import { Input, Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { GlobalCartesianDataService } from '../app/global-cartesian-data.service';

interface ILayersInformation {
  parentId?: number;
  grandParentId?: number;
  description: string;
  active: boolean;
  visible?: boolean;
  dbId: number
}

interface IGISLayers {
  visible: boolean;
  StructureTypeId: number;
  DataPointTypeId: number;
  SubStructureId: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  StructureTypeInfo: ILayersInformation[] = [];
  dataPointInfo: ILayersInformation[] = [];
  SubStructureInfo: ILayersInformation[] = [];
  SubStructureGIS: IGISLayers[] = [];

  constructor(
    private cartesianData: GlobalCartesianDataService,
    private fb: FormBuilder
  ) { }

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
          dbId: SType.StructureTypeId
        });
        SType.DataPointTypes.forEach(
          (DataType: any) => {
            this.DataPointArray.push(this.fb.control(false));
            this.dataPointInfo.push({
              parentId: this.StructureTypeInfo.length - 1,
              description: DataType.Description,
              active: false,
              dbId: DataType.DataPointTypeId
            });
            DataType.SubStructures.forEach(
              (SubStructureType: any) => {
                this.SubStructureTypeArray.push(this.fb.control(false));
                this.SubStructureInfo.push({
                  parentId: this.dataPointInfo.length - 1,
                  grandParentId: this.StructureTypeInfo.length - 1,
                  description: SubStructureType.Description,
                  active: false,
                  visible: false,
                  dbId: SubStructureType.SubStructureId
                });
              }
            );
          }
        );
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
          this.SubStructureInfo[i].active = e;
        });
        this.updateVisibleLayers();
      });
    });
  }

  updateVisibleLayers() {
    this.SubStructureInfo.forEach(
      (subStr: ILayersInformation, index: number) => {

        this.SubStructureGIS.splice(index, 1, {
          visible: this.StructureTypeInfo[subStr.grandParentId].active &&
            this.dataPointInfo[subStr.parentId].active &&
            subStr.active,
          StructureTypeId: this.StructureTypeInfo[subStr.grandParentId].dbId,
          DataPointTypeId: this.dataPointInfo[subStr.parentId].dbId,
          SubStructureId: subStr.dbId
        })
      }
    )

  }

  test() {
    this.SubStructureGIS.forEach((AA, i) => {
      console.log(AA.visible, i);
    });
  }
}
