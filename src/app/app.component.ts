import { HttpHeaders } from '@angular/common/http';
import { Input, Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { GlobalCartesianDataService } from '../app/global-cartesian-data.service';

interface LayersInformation {
  id: number;
  parentId?: number;
  grandParentId?: number;
  description: string;
  active: boolean;
  visible?: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  StructureTypeInfo: LayersInformation[] = [];
  dataPointInfo: LayersInformation[] = [];
  SubStructureInfo: LayersInformation[] = [];

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
      layers.forEach((SType: any, layerId: number) => {
        this.StructureTypeArray.push(this.fb.control(false));
        this.StructureTypeInfo.push({
          id: layerId,
          description: SType.Description,
          active: false,
        });
        SType.DataPointTypes.forEach(
          (DataType: any, DataPointTypeId: number) => {
            this.DataPointArray.push(this.fb.control(false));
            this.dataPointInfo.push({
              id: DataPointTypeId,
              parentId: layerId,
              description: DataType.Description,
              active: false,
            });
            DataType.SubStructures.forEach(
              (SubStructureType: any, SubStructureId: number) => {
                this.SubStructureTypeArray.push(
                  this.fb.control(false)
                );
                this.SubStructureInfo.push({
                  id: SubStructureId,
                  parentId: DataPointTypeId,
                  grandParentId: layerId,
                  description: SubStructureType.Description,
                  active: false,
                  visible: false
                });
              }
            );
          }
        );
      });

      this.allLayers.valueChanges.subscribe(({ StructureTypesArray }) => {
        StructureTypesArray.forEach((e: boolean, i: number) => {
          this.StructureTypeInfo[i].active = e
        });
        this.updateVisibleLayers()
      });

      this.allStructures.valueChanges.subscribe(({ DataPointsArray }) => {
        DataPointsArray.forEach((e: boolean, i: number) => {
          this.dataPointInfo[i].active = e
        });
        this.updateVisibleLayers()
      });

      this.allDataPoints.valueChanges.subscribe(({ SubStructuresArray }) => {
        SubStructuresArray.forEach((e: boolean, i: number) => {
          this.SubStructureInfo[i].active = e
        });
        this.updateVisibleLayers()
      });

    })
  }

  updateVisibleLayers() {
    this.SubStructureInfo.forEach((subStr: LayersInformation, index: number) => {
      if (this.StructureTypeInfo[subStr.grandParentId].active && this.dataPointInfo[subStr.parentId].active  && this.SubStructureInfo[subStr.id].active) {
        this.SubStructureInfo[index].visible = true
      }
    });
  }

  test() {
    this.SubStructureInfo.forEach(({ visible, active }, i) => {
      console.log(visible, i);
    });
  }
}