import { Component, ViewChild, ElementRef } from '@angular/core';
import Chart from 'chart.js/auto';
import * as Papa from 'papaparse';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

  @ViewChild('chartCanvas') chartCanvasRef!: ElementRef<HTMLCanvasElement>;

  fileContent: string | undefined;
  chart: Chart<'pie'> | undefined;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.fileContent = reader.result as string;
      this.processFileContent();
    };

    reader.readAsText(file);
  }

  onFileDrop(event: any) {
    event.preventDefault();
    const file: File = event.dataTransfer.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.fileContent = reader.result as string;
      this.processFileContent();
    };

    reader.readAsText(file);
  }

  onDragOver(event: any) {
    event.preventDefault();
  }

  processFileContent() {
    if (this.fileContent) {
      const parsedData = Papa.parse(this.fileContent, { header: false });
      const data = parsedData.data as string[][];

      // Realizar los cálculos necesarios
      const dataGraph = this.calculateDataGraph(data);
      this.renderChart(dataGraph);
    }
  }

  calculateStateMax(data: string[][]) {
    // Lógica para calcular el estado con el mayor acumulado
    let stateMax = '';
    let maxAcum = -1;

    for (let i = 0; i < data.length; i++) {
      const acum = parseInt(data[i][1]);
      if (acum > maxAcum) {
        maxAcum = acum;
        stateMax = data[i][0];
      }
    }

    return stateMax;
  }

  calculateStateMin(data: string[][]) {
    // Lógica para calcular el estado con el menor acumulado
    let stateMin = '';
    let minAcum = Infinity;

    for (let i = 0; i < data.length; i++) {
      const acum = parseInt(data[i][1]);
      if (acum < minAcum) {
        minAcum = acum;
        stateMin = data[i][0];
      }
    }

    return stateMin;
  }

  calculateStateMostAffected(data: string[][]) {
    // Lógica para calcular el estado más afectado
    let stateMostAffected = '';
    let mayorAfectacion = -1;

    for (let i = 0; i < data.length; i++) {
      const afectacion = parseInt(data[i][2]);
      if (afectacion > mayorAfectacion) {
        mayorAfectacion = afectacion;
        stateMostAffected = data[i][0];
      }
    }

    return stateMostAffected;
  }

  renderChart(dataGraph: any) {
    const ctx = this.chartCanvasRef.nativeElement.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: dataGraph.labels,
          datasets: [
            {
              label: 'Value',
              data: dataGraph.data,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }

  calculateDataGraph(data: string[][]) {
    // Lógica para calcular los datos de la gráfica
    const labels = [
      'Estado con mayor acumulado a la fecha',
      'Estado con menor acumulado a la fecha',
      'Estado más afectado a la fecha',
    ];
    const deaths = data.map((row) => parseInt(row[3]));
    const population = data.map((row) => parseInt(row[4]));

    const percentageDeaths = deaths.map((value, index) => {
      return (value / population[index]) * 100;
    });

    const chartData = [
      percentageDeaths[1],
      percentageDeaths[2],
      percentageDeaths[3],
    ];

    return {
      labels: labels,
      data: chartData,
    };
  }
}
