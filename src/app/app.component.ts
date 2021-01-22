import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  isCalculate: boolean = false

  title = 'ANN by Arigo';

  operation = "null"

  epoch = 1

  lr_a = 0.2
  thr = 0.5

  w1_input = 0
  w2_input = 0

  w1 = 0
  w2 = 0

  dataInit = dataInit

  dataProcess: any = []

  dataResult: any = []

  constructor (){

  }

  ngOnInit(): void {
    
  }

  disabledButton(){
    if (this.operation == 'null' || this.w1_input == 0 ||  this.w1_input == null || this.w2_input == 0 || this.w2_input == null || this.isCalculate == true){
      return true
    } else {
      return false
    }
  }

  calculate(){
    this.w1 = this.w1_input
    this.w2 = this.w2_input
    this.process()
  }

  reset(){
    this.isCalculate = false
    this.epoch = 1
    this.dataResult = []
  }

  process(){
    this.dataProcess = []

    for (let i=0; i < this.dataInit.length; i++){
      this.dataProcess.push(this.dataInit[i])
    }

    for (let i=0; i < this.dataProcess.length; i++) {
      if (this.operation == 'and'){
        this.dataProcess[i].z_value = this.dataProcess[i].x1 && this.dataProcess[i].x2
      } else if (this.operation == 'or') {
        this.dataProcess[i].z_value = this.dataProcess[i].x1 || this.dataProcess[i].x2
      }

      this.dataProcess[i].w1_value = this.w1
      this.dataProcess[i].w2_value = this.w2

      this.dataProcess[i].sum = ((this.dataProcess[i].x1 * this.dataProcess[i].w1_value) + (this.dataProcess[i].x2 * this.dataProcess[i].w2_value))

      if (this.dataProcess[i].sum > this.thr){
        this.dataProcess[i].y_value = 1
      } else {
        this.dataProcess[i].y_value = 0
      }

      this.dataProcess[i].zy_value = this.dataProcess[i].z_value - this.dataProcess[i].y_value

      this.dataProcess[i].w1new_value = this.dataProcess[i].w1_value + this.lr_a * this.dataProcess[i].zy_value * this.dataProcess[i].x1
      this.w1 = this.dataProcess[i].w1new_value
      this.dataProcess[i].w2new_value = this.dataProcess[i].w2_value + this.lr_a * this.dataProcess[i].zy_value * this.dataProcess[i].x2
      this.w2 = this.dataProcess[i].w2new_value
    }
    // console.log(this.dataProcess)

    let InitEpoch = {
      epoch: this.epoch,
      dataProcess: []
    }

    for (let i=0; i < this.dataProcess.length; i++){
      let data = {
        x1: this.dataProcess[i].x1,
        x2: this.dataProcess[i].x2,
        z_value: this.dataProcess[i].z_value,
        w1_value: this.dataProcess[i].w1_value,
        w2_value: this.dataProcess[i].w2_value,
        sum: this.dataProcess[i].sum,
        y_value: this.dataProcess[i].y_value,
        zy_value: this.dataProcess[i].zy_value,
        w1new_value: this.dataProcess[i].w1new_value,
        w2new_value: this.dataProcess[i].w2new_value,
      }
      InitEpoch.dataProcess.push(data)
    }

    this.epoch = this.epoch + 1

    this.dataResult.push(InitEpoch)

    var isError = false

    for (let i=0; i < this.dataProcess.length; i++){
      if (this.dataProcess[i].zy_value == 1){
        isError = true
        break
      }
    }

    if (isError) {
      this.process()
    } else {
      this.isCalculate = true
    }
  }
}

let dataInit = [
  {
    x1: 0,
    x2: 0
  },
  {
    x1: 0,
    x2: 1
  },
  {
    x1: 1,
    x2: 0
  },
  {
    x1: 1,
    x2: 1
  }
]
